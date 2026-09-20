import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4172/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(6000);

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.locator('[data-view="course"]').click();
  await page.waitForSelector('#courseList.lesson-sequence-sidebar');

  const lessonCount=await page.locator('[data-seq-lesson]').count();
  if(lessonCount!==16) throw new Error('Expected 16 lessons, found '+lessonCount);

  for(let li=0;li<lessonCount;li++){
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.waitForTimeout(15);
    const lessonNo=li+1;
    await page.locator('#lessonPanel [data-seq-stage="0"]').evaluate(el=>el.click());
    await page.waitForTimeout(10);
    const starterInputs=page.locator('.lesson-active-section [data-starter-input]');
    if(await starterInputs.count()!==3) throw new Error('Lesson '+lessonNo+' starter answer boxes missing');
    await starterInputs.first().fill('Saved starter test response');
    await page.waitForTimeout(5);
    const storedStarter=await page.evaluate(lessonNo=>{
      try{return JSON.parse(localStorage.getItem('particleLessonStarterAnswersV1')||'{}')?.[lessonNo]?.[0]||''}catch{return ''}
    },lessonNo);
    if(storedStarter!=='Saved starter test response') throw new Error('Lesson '+lessonNo+' starter answer did not save');

    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForTimeout(15);
    const coverage=page.locator('.lesson-active-section .aqa-core-knowledge');
    if(!(await coverage.count())) throw new Error('Lesson '+lessonNo+' AQA core knowledge panel missing');
    if((await coverage.locator('li').count())<4) throw new Error('Lesson '+lessonNo+' AQA core knowledge is too thin');

    const lesson=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.lessons?.find(x=>x.n===Number((document.querySelector('#lessonPanel .lesson-count')?.textContent||'').match(/Lesson\s+(\d+)/i)?.[1]||1)));
    if(!lesson) throw new Error('Lesson '+lessonNo+' data missing');

    const chunks=page.locator('.lesson-active-section .native-chunk-list > .lesson-chunk-rich');
    const count=await chunks.count();
    if(count!==lesson.teach.length) throw new Error('Lesson '+lessonNo+' chunk count mismatch '+count+' vs '+lesson.teach.length);

    for(let ci=0;ci<count;ci++){
      const detail=page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="'+ci+'"]');
      const summary=detail.locator(':scope > summary');
      if(!(await summary.count())) throw new Error('Lesson '+lessonNo+' chunk '+(ci+1)+' heading missing');
      if(!(await detail.evaluate(el=>el.open))){
        await summary.evaluate(el=>el.click());
        await page.waitForTimeout(5);
      }
      if(!(await detail.evaluate(el=>el.open))) throw new Error('Lesson '+lessonNo+' chunk '+(ci+1)+' would not open');
    }

    if(count>1){
      await page.locator('[data-core-chunk="0"]').evaluate(el=>el.click());
      await page.waitForTimeout(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==0) throw new Error('Lesson '+lessonNo+' could not select chunk 1');
      await page.locator('#coreChunkNext').evaluate(el=>el.click());
      await page.waitForTimeout(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==1) throw new Error('Lesson '+lessonNo+' Next chunk failed');
      const second=page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="1"]');
      if(!(await second.evaluate(el=>el.open))) throw new Error('Lesson '+lessonNo+' Next chunk did not open chunk 2');
      await page.locator('#coreChunkPrev').evaluate(el=>el.click());
      await page.waitForTimeout(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==0) throw new Error('Lesson '+lessonNo+' Previous chunk failed');
    }
  }

  console.log('LESSON CHUNK TEST PASSED: all 16 lessons, all native chunk headings, Next and Previous.');
}finally{
  await browser.close();
}
