import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.setDefaultTimeout(8000);
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{ if(m.type()==='error') errors.push('console: '+m.text()); });

const pause=(ms=35)=>page.waitForTimeout(ms);
const activeView=async id=>page.locator('#view-'+id).evaluate(el=>el.classList.contains('active-view'));

try {
  console.log('STEPS: boot');
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.locator('[data-view="course"]').click();
  await page.waitForSelector('#courseList.lesson-sequence-sidebar');

  const lessonData=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.lessons||[]);
  const stageData=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.stages||[]);
  const taskBankData=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.taskBank||{});
  if(lessonData.length!==16) throw new Error('Expected 16 lessons, found '+lessonData.length);
  if(stageData.length!==7) throw new Error('Expected 7 guided stages, found '+stageData.length);

  console.log('STEPS: every lesson stage and activity hand-off');
  for(let li=0; li<lessonData.length; li++){
    await page.locator('[data-seq-lesson]').nth(li).click();
    await pause();
    const lesson=lessonData[li];
    const title=((await page.locator('#lessonPanel h2').textContent())||'').trim();
    if(title!==lesson.title) throw new Error('Lesson '+lesson.n+' title mismatch: '+title);

    const stageButtons=page.locator('#lessonPanel [data-seq-stage]');
    if(await stageButtons.count()!==7) throw new Error('Lesson '+lesson.n+' does not expose all 7 guided stages');

    for(let si=0; si<stageData.length; si++){
      await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').click();
      await pause(25);
      const active=page.locator('#lessonPanel [data-seq-stage="'+si+'"]');
      if(!(await active.evaluate(el=>el.classList.contains('active')))) throw new Error('Lesson '+lesson.n+' stage '+si+' did not become active');

      const stage=stageData[si];
      const heading=((await page.locator('.lesson-active-section h3').textContent())||'').trim();
      if(heading!==stage.label) throw new Error('Lesson '+lesson.n+' stage '+stage.id+' heading mismatch: '+heading);

      if(stage.id==='recall'){
        const count=await page.locator('.lesson-active-section li').count();
        if(count<lesson.recall.length) throw new Error('Lesson '+lesson.n+' recall stage is incomplete');
      }
      if(stage.id==='objectives'){
        const count=await page.locator('.lesson-active-section li').count();
        if(count!==lesson.objectives.length) throw new Error('Lesson '+lesson.n+' objectives stage is incomplete');
      }
      if(stage.id==='teach'){
        const count=await page.locator('.lesson-active-section .lesson-check').count();
        if(count!==lesson.teach.length){
          const debug=await page.locator('.lesson-active-section').evaluate(el=>({
            html:el.innerHTML,
            chunks:[...el.querySelectorAll('[data-lesson-chunk]')].map(x=>({i:x.dataset.lessonChunk,text:(x.textContent||'').slice(0,260)})),
            checks:[...el.querySelectorAll('.lesson-check')].map(x=>(x.textContent||'').slice(0,180))
          }));
          console.error('TEACH_CHUNK_DEBUG',JSON.stringify(debug,null,2));
          throw new Error('Lesson '+lesson.n+' teaching chunks mismatch: '+count+' vs '+lesson.teach.length);
        }
        const detailCount=await page.locator('.lesson-active-section .lesson-chunk-detail').count();
        const taskCount=await page.locator('.lesson-active-section .lesson-chunk-task').count();
        const examCount=await page.locator('.lesson-active-section .lesson-chunk-exam').count();
        if(detailCount!==lesson.teach.length||taskCount!==lesson.teach.length||examCount!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' rich chunk support is incomplete');

        const chunkTabs=page.locator('.lesson-active-section [data-core-chunk]');
        if(await chunkTabs.count()!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' core chunk selector mismatch');
        for(let ci=0; ci<lesson.teach.length; ci++){
          await page.locator('.lesson-active-section [data-core-chunk="'+ci+'"]').click();
          await pause(25);
          const activeChunk=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.());
          if(activeChunk!==ci) throw new Error('Lesson '+lesson.n+' chunk '+ci+' did not become active');
          const visible=page.locator('.lesson-active-section .lesson-chunk-rich:not([hidden])');
          if(await visible.count()!==1) throw new Error('Lesson '+lesson.n+' should show exactly one teaching chunk');
          if(Number(await visible.getAttribute('data-lesson-chunk'))!==ci) throw new Error('Lesson '+lesson.n+' visible teaching chunk mismatch');
        }
        if(lesson.teach.length>1){
          await page.locator('.lesson-active-section [data-core-chunk="0"]').click();
          await pause(20);
          await page.locator('#coreChunkNext').click();
          await pause(25);
          if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==1) throw new Error('Lesson '+lesson.n+' Next chunk button failed');
          await page.locator('#coreChunkPrev').click();
          await pause(25);
          if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==0) throw new Error('Lesson '+lesson.n+' Previous chunk button failed');
        }
      }
      if(stage.id==='simulate'){
        const activity=page.locator('#sequenceActivity');
        if(!(await activity.count())) throw new Error('Lesson '+lesson.n+' simulation/activity action missing');
        await activity.click();
        await pause(100);
        if(lesson.sim){
          if(!(await activeView('lab'))) throw new Error('Lesson '+lesson.n+' did not open lab');
          const sim=await page.evaluate(()=>window.PARTICLELAB_CORE?.getCurrentSim?.());
          if(sim!==lesson.sim) throw new Error('Lesson '+lesson.n+' opened '+sim+' instead of '+lesson.sim);
        }else{
          const view=lesson.view||'quiz';
          if(!(await activeView(view))) throw new Error('Lesson '+lesson.n+' did not open '+view);
        }
        await page.locator('[data-view="course"]').click();
        await pause(50);
        await page.locator('[data-seq-lesson]').nth(li).click();
        await pause(30);
        await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').click();
        await pause(20);
      }
      if(stage.id==='practice'){
        if(!(await page.locator('#sequenceExamPractice').count())) throw new Error('Lesson '+lesson.n+' exam-practice action missing');
        const expectedTasks=(taskBankData[lesson.n]||[]).length;
        const renderedTasks=await page.locator('.lesson-task-card').count();
        if(expectedTasks<3) throw new Error('Lesson '+lesson.n+' configured task bank has fewer than 3 tasks');
        if(renderedTasks!==expectedTasks) throw new Error('Lesson '+lesson.n+' task bank mismatch: rendered '+renderedTasks+' vs configured '+expectedTasks);
      }
      if(stage.id==='exit'){
        const expected=Math.min(5,Math.max(3,(taskBankData[lesson.n]||[]).length));
        const tests=page.locator('.lesson-active-section .short-test-question');
        if(await tests.count()!==expected) throw new Error('Lesson '+lesson.n+' short-test question count mismatch');
        if(await page.locator('.lesson-active-section .short-test-question textarea').count()!==expected) throw new Error('Lesson '+lesson.n+' short-test answer boxes missing');
        if(await page.locator('.lesson-active-section .short-test-question details').count()!==expected) throw new Error('Lesson '+lesson.n+' short-test mark-point reveals missing');
      }
      if(stage.id==='next'){
        const txt=(await page.locator('.lesson-active-section').textContent())||'';
        if(!/Homework:/i.test(txt)) throw new Error('Lesson '+lesson.n+' homework step missing');
      }
    }

    // Back/forward step buttons are part of the guided route.
    await page.locator('#lessonPanel [data-seq-stage="1"]').click();
    await pause(20);
    if(!(await page.locator('#lessonStepBack').count())) throw new Error('Lesson '+lesson.n+' previous-step button missing');
    await page.locator('#lessonStepBack').click();
    await pause(20);
    const firstActive=await page.locator('#lessonPanel [data-seq-stage="0"]').evaluate(el=>el.classList.contains('active'));
    if(!firstActive) throw new Error('Lesson '+lesson.n+' previous-step navigation failed');

    // Complete all seven guided steps using the real progression button.
    for(let si=0; si<stageData.length; si++){
      const activeBefore=await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').evaluate(el=>el.classList.contains('active'));
      if(!activeBefore) throw new Error('Lesson '+lesson.n+' completion flow was not on step '+si);
      const doneButton=page.locator('#lessonStepDone');
      if(!(await doneButton.count())) throw new Error('Lesson '+lesson.n+' step '+si+' completion button missing');
      await doneButton.click();
      await pause(30);
      const finished=await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').evaluate(el=>el.classList.contains('done'));
      if(!finished) throw new Error('Lesson '+lesson.n+' step '+si+' did not record as done');
      if(si<stageData.length-1){
        const advanced=await page.locator('#lessonPanel [data-seq-stage="'+(si+1)+'"]').evaluate(el=>el.classList.contains('active'));
        if(!advanced) throw new Error('Lesson '+lesson.n+' did not advance from step '+si+' to '+(si+1));
      }
    }
    const completeText=(await page.locator('#sequenceComplete').textContent())||'';
    if(!/Lesson complete/i.test(completeText)) throw new Error('Lesson '+lesson.n+' did not complete after all seven steps');
  }

  console.log('STEPS: every core mastery chunk and gate');
  for(let li=0; li<15; li++){
    const lesson=lessonData[li];
    await page.locator('[data-seq-lesson]').nth(li).click();
    await pause(45);
    const chunkCount=await page.locator('#studentMasteryPath .mastery-chunk-tab').count();
    if(chunkCount!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' mastery chunk count mismatch');

    for(let ci=0; ci<chunkCount; ci++){
      const textarea=page.locator('[data-retrieval="'+ci+'"]');
      if(!(await textarea.count())) throw new Error('Lesson '+lesson.n+' chunk '+ci+' retrieval box missing');
      const taskBox=page.locator('[data-chunk-task="'+ci+'"]');
      if(!(await taskBox.count())) throw new Error('Lesson '+lesson.n+' chunk '+ci+' application task checkbox missing');
      if(!(await page.locator('.mastery-apply details').count())) throw new Error('Lesson '+lesson.n+' chunk '+ci+' check answer missing');
      const secure=page.locator('[data-secure-chunk="'+ci+'"]');
      if(!(await secure.isDisabled())) throw new Error('Lesson '+lesson.n+' chunk '+ci+' can be secured without task and retrieval');
      await taskBox.check();
      await pause(15);
      if(!(await secure.isDisabled())) throw new Error('Lesson '+lesson.n+' chunk '+ci+' unlocked before retrieval');
      const textarea2=page.locator('[data-retrieval="'+ci+'"]');
      await textarea2.fill('I can explain this physics idea clearly using the correct AQA terminology and reasoning.');
      await pause(15);
      const secure2=page.locator('[data-secure-chunk="'+ci+'"]');
      if(await secure2.isDisabled()) throw new Error('Lesson '+lesson.n+' chunk '+ci+' did not unlock after task and retrieval');
      await secure2.click();
      await pause(30);
      if(ci<chunkCount-1){
        const next=page.locator('#masteryNext');
        if(await next.isDisabled()) throw new Error('Lesson '+lesson.n+' chunk '+ci+' did not unlock the next chunk');
        await next.click();
        await pause(25);
      }
    }

    for(let ei=0; ei<lesson.exit.length; ei++){
      const box=page.locator('[data-exit="'+ei+'"]');
      await box.check();
      await pause(25);
    }
    const unlock=(await page.locator('#masteryUnlockStatus').textContent())||'';
    if(!/Lesson secure/i.test(unlock)) throw new Error('Lesson '+lesson.n+' mastery gate did not report secure');
    if(li<14 && await page.locator('#sequenceNext').isDisabled()) throw new Error('Lesson '+lesson.n+' next lesson stayed locked after mastery');
  }

  // Prove the next/previous lesson buttons work once mastery allows them.
  await page.locator('[data-seq-lesson]').first().click(); await pause(25);
  const firstTitle=((await page.locator('#lessonPanel h2').textContent())||'').trim();
  await page.locator('#sequenceNext').click(); await pause(30);
  const secondTitle=((await page.locator('#lessonPanel h2').textContent())||'').trim();
  if(secondTitle===firstTitle) throw new Error('Next lesson navigation did not advance');
  await page.locator('#sequencePrev').click(); await pause(30);
  if(((await page.locator('#lessonPanel h2').textContent())||'').trim()!==firstTitle) throw new Error('Previous lesson navigation did not return');

  // Extension must remain outside the core mastery route.
  await page.locator('[data-seq-lesson]').nth(15).click(); await pause(30);
  const ext=(await page.locator('#studentMasteryPath').textContent())||'';
  if(!/Separate extension/i.test(ext)) throw new Error('Rutherford extension is not separated from core mastery');

  console.log('STEPS: every simulation mission step');
  await page.locator('[data-view="lab"]').click();
  await page.waitForSelector('#simNav .sim-tab');
  const simIds=await page.locator('#simNav .sim-tab').evaluateAll(ns=>ns.map(n=>n.dataset.sim));
  for(const id of simIds){
    await page.locator('#simNav .sim-tab[data-sim="'+id+'"]').click();
    await pause(70);
    const mission=page.locator('#simulationMissionPanel');
    if(!(await mission.count())) throw new Error(id+': mission panel missing');
    const stepCount=await mission.locator('[data-mission-done]').count();
    if(stepCount<3) throw new Error(id+': expected at least 3 mission steps');

    await page.locator('#missionPrediction').fill('I predict a measurable change based on the physics model.');
    await page.locator('#missionExplanation').fill('The result follows from the relevant AQA physics relationship and conservation rules.');

    for(let mi=0; mi<stepCount; mi++){
      const reveal=page.locator('[data-mission-observe="'+mi+'"]');
      await reveal.click(); await pause(12);
      if(await page.locator('#missionObs'+mi).isHidden()) throw new Error(id+': mission observation '+mi+' did not reveal');
      await page.locator('[data-mission-done="'+mi+'"]').click(); await pause(20);
      const state=await page.evaluate(({id,mi})=>!!window.PARTICLELAB_SIM_MISSIONS?.state?.[id]?.steps?.[mi],{id,mi});
      if(!state) throw new Error(id+': mission step '+mi+' did not persist as complete');
    }

    const correct=await page.evaluate(id=>window.PARTICLELAB_SIM_MISSIONS?.missions?.[id]?.check?.[2],id);
    if(!Number.isInteger(correct)) throw new Error(id+': mission mastery answer key missing');
    await page.locator('[data-mission-answer="'+correct+'"]').click(); await pause(25);
    const secure=await page.evaluate(id=>!!window.PARTICLELAB_SIM_MISSIONS?.state?.[id]?.secure,id);
    if(!secure) throw new Error(id+': mission mastery check did not become secure');
  }

  if(errors.length) throw new Error('Browser errors:\n'+[...new Set(errors)].join('\n'));
  console.log('ALL STEP VERIFICATION PASSED: '+lessonData.length+' lessons × '+stageData.length+' stages, all core mastery chunks, and '+simIds.length+' simulation missions.');
} finally {
  await browser.close();
}
