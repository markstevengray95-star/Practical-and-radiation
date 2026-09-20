(() => {
  'use strict';

  const STAGE_STORE='particleLessonStagesV2';
  const LESSON_STORE='particleLessonSequenceV1';
  const CHUNK_STORE='particleChunkMasteryV1';

  const api=()=>window.PARTICLELAB_LESSON_SEQUENCE;

  function readJSON(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
    catch{return fallback;}
  }

  function writeJSON(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch{}
  }

  function activeLessonIndex(){
    const active=document.querySelector('#courseList [data-seq-lesson].active');
    const n=Number(active?.dataset.seqLesson);
    return Number.isInteger(n)?n:0;
  }

  function activeLessonNumber(){
    const a=api();
    return a?.lessons?.[activeLessonIndex()]?.n||1;
  }

  function activeStageIndex(){
    const active=document.querySelector('#lessonPanel [data-seq-stage].active');
    const n=Number(active?.dataset.seqStage);
    return Number.isInteger(n)?n:0;
  }

  function markCurrentStageComplete(){
    const a=api();
    if(!a?.lessons?.length||!a?.stages?.length)return;
    const lessonNumber=activeLessonNumber();
    const stageIndex=activeStageIndex();
    const stage=a.stages[stageIndex];
    if(!stage)return;

    const stageState=readJSON(STAGE_STORE,{});
    const done=new Set(stageState[lessonNumber]||[]);
    done.add(stage.id);
    stageState[lessonNumber]=[...done];
    writeJSON(STAGE_STORE,stageState);

    const completed=new Set(readJSON(LESSON_STORE,[]));
    if(done.size>=a.stages.length)completed.add(lessonNumber);
    writeJSON(LESSON_STORE,[...completed]);

    a.openLesson?.(lessonNumber);
    setTimeout(()=>{
      const next=Math.min(stageIndex+1,a.stages.length-1);
      a.openStage?.(next);
    },20);
  }

  function getChunkState(){
    return readJSON(CHUNK_STORE,{});
  }

  function setChunkFlag(lessonNumber,chunkIndex,flag,on){
    const state=getChunkState();
    const key=lessonNumber+':'+chunkIndex;
    state[key]=state[key]||{};
    state[key][flag]=on;
    writeJSON(CHUNK_STORE,state);
  }

  function updateChunkUI(){
    const lessonNumber=activeLessonNumber();
    const state=getChunkState();
    const cards=[...document.querySelectorAll('#lessonPanel .lesson-chunk-rich')];
    let secure=0;

    cards.forEach(card=>{
      const i=Number(card.dataset.lessonChunk||0);
      const s=state[lessonNumber+':'+i]||{};
      const flags=['explain','apply','exam'];
      const done=flags.filter(k=>s[k]).length;
      if(done===flags.length)secure++;
      card.classList.toggle('chunk-secure',done===flags.length);
      card.querySelectorAll('[data-chunk-flag]').forEach(button=>{
        const on=!!s[button.dataset.chunkFlag];
        button.classList.toggle('active',on);
        button.setAttribute('aria-pressed',String(on));
        button.textContent=(on?'✓ ':'')+button.dataset.label;
      });
      const meter=card.querySelector('.chunk-card-meter');
      if(meter)meter.style.width=(done/flags.length*100)+'%';
      const count=card.querySelector('.chunk-card-count');
      if(count)count.textContent=done+' / '+flags.length+' checks';
    });

    document.querySelectorAll('#lessonPanel .chunk-mastery-summary').forEach(summary=>{
      const total=cards.length;
      summary.querySelector('[data-chunk-summary-text]').textContent=secure+' / '+total+' chunks secure';
      summary.querySelector('[data-chunk-summary-fill]').style.width=(total?secure/total*100:0)+'%';
    });
  }

  function enhanceChunks(){
    const a=api();
    if(!a?.lessons)return;
    const lessonNumber=activeLessonNumber();
    const lesson=a.lessons.find(l=>l.n===lessonNumber);
    if(!lesson)return;

    const cards=[...document.querySelectorAll('#lessonPanel .lesson-chunk-rich')];
    if(!cards.length)return;

    const list=cards[0].parentElement;
    if(list&&!list.previousElementSibling?.classList?.contains('chunk-mastery-summary')){
      const summary=document.createElement('div');
      summary.className='chunk-mastery-summary';
      summary.innerHTML='<div><span class="eyebrow">Teach-stage mastery</span><strong data-chunk-summary-text>0 / '+cards.length+' chunks secure</strong></div><div class="chunk-summary-track"><div class="chunk-summary-fill" data-chunk-summary-fill></div></div><div class="chunk-quick-nav" aria-label="Teaching chunk navigation">'+cards.map((_,i)=>'<button type="button" data-chunk-jump="'+i+'" aria-label="Go to chunk '+(i+1)+'">'+(i+1)+'</button>').join('')+'</div>';
      list.insertAdjacentElement('beforebegin',summary);
    }

    cards.forEach((card,i)=>{
      if(card.querySelector('.chunk-mastery-check'))return;
      const support=a.getChunkSupport?.(lessonNumber,i)||{};
      const box=document.createElement('div');
      box.className='chunk-mastery-check';
      box.innerHTML=
        '<div class="chunk-check-head"><div><span class="eyebrow">Before you move on</span><strong>Prove you understand this chunk</strong></div><span class="chunk-card-count">0 / 3 checks</span></div>'+
        '<div class="chunk-card-track"><div class="chunk-card-meter"></div></div>'+
        '<div class="chunk-proof-grid">'+
          '<div><strong>1 · Explain</strong><p>Close the notes and explain the idea in your own words using the correct physics terms.</p></div>'+
          '<div><strong>2 · Apply</strong><p>'+(support.task||'Apply this idea to a new example or calculation.')+'</p></div>'+
          '<div><strong>3 · Exam language</strong><p>'+(support.exam||lesson.exam||'State the idea using precise AQA terminology.')+'</p></div>'+
        '</div>'+
        '<div class="chunk-proof-actions">'+
          '<button type="button" data-chunk-flag="explain" data-label="I can explain it">I can explain it</button>'+
          '<button type="button" data-chunk-flag="apply" data-label="I can apply it">I can apply it</button>'+
          '<button type="button" data-chunk-flag="exam" data-label="I can use exam wording">I can use exam wording</button>'+
        '</div>'+
        (i<cards.length-1?'<button type="button" class="text-button chunk-next" data-chunk-jump="'+(i+1)+'">Next teaching chunk →</button>':'');
      card.appendChild(box);
    });

    updateChunkUI();
  }

  function improveAccessibility(){
    document.querySelectorAll('#lessonPanel button,#courseList button').forEach(b=>{
      if(!b.getAttribute('type'))b.setAttribute('type','button');
    });
    document.querySelectorAll('#courseList [data-seq-lesson]').forEach(b=>{
      b.setAttribute('aria-current',b.classList.contains('active')?'step':'false');
    });
    document.querySelectorAll('#lessonPanel [data-seq-stage]').forEach(b=>{
      b.setAttribute('aria-current',b.classList.contains('active')?'step':'false');
    });
  }

  function enhance(){
    if(!api())return;
    improveAccessibility();
    enhanceChunks();
  }

  document.addEventListener('click',event=>{
    const a=api();
    if(!a)return;
    const target=event.target.closest('button,[role="button"]');
    if(!target)return;

    if(target.matches('#courseList [data-seq-lesson]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const i=Number(target.dataset.seqLesson);
      const n=a.lessons?.[i]?.n;
      if(n)a.openLesson?.(n);
      return;
    }

    if(target.matches('#lessonPanel [data-seq-stage]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      a.openStage?.(Number(target.dataset.seqStage));
      return;
    }

    if(target.matches('#sequencePrev,#sequenceNext')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const delta=target.id==='sequencePrev'?-1:1;
      const next=activeLessonIndex()+delta;
      const n=a.lessons?.[next]?.n;
      if(n)a.openLesson?.(n);
      return;
    }

    if(target.matches('#lessonStepBack')){
      event.preventDefault();
      event.stopImmediatePropagation();
      a.openStage?.(Math.max(0,activeStageIndex()-1));
      return;
    }

    if(target.matches('#lessonStepDone')){
      event.preventDefault();
      event.stopImmediatePropagation();
      markCurrentStageComplete();
      return;
    }

    if(target.matches('[data-chunk-jump]')){
      event.preventDefault();
      const i=Number(target.dataset.chunkJump);
      document.querySelector('#lessonPanel .lesson-chunk-rich[data-lesson-chunk="'+i+'"]')?.scrollIntoView({behavior:'smooth',block:'start'});
      return;
    }

    if(target.matches('[data-chunk-flag]')){
      event.preventDefault();
      const card=target.closest('.lesson-chunk-rich');
      const i=Number(card?.dataset.lessonChunk||0);
      const state=getChunkState();
      const current=!!state[activeLessonNumber()+':'+i]?.[target.dataset.chunkFlag];
      setChunkFlag(activeLessonNumber(),i,target.dataset.chunkFlag,!current);
      updateChunkUI();
    }
  },true);

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  function init(){
    const course=document.querySelector('#view-course');
    if(course)observer.observe(course,{childList:true,subtree:true});
    enhance();
    setTimeout(enhance,500);
    setTimeout(enhance,1400);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();