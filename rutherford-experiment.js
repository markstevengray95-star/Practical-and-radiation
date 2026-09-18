
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const K = 8.9875517923e9;
  const E_CHARGE = 1.602176634e-19;
  const Z_GOLD = 79;
  const Z_ALPHA = 2;

  let running = false;
  let animationId = 0;
  let particles = [];
  let counts = { fired:0, straight:0, small:0, large:0 };
  let mode = 'apparatus';
  let impactFm = 55;
  let energyMeV = 5.5;

  function addView() {
    const nav = $('.main-nav');
    const main = $('main.main');
    if (!nav || !main || $('#view-rutherfordexp')) return;

    const navButton = document.createElement('button');
    navButton.className = 'nav-button';
    navButton.dataset.view = 'rutherfordexp';
    navButton.textContent = 'Rutherford experiment';
    nav.appendChild(navButton);

    const section = document.createElement('section');
    section.id = 'view-rutherfordexp';
    section.className = 'view';
    section.innerHTML = `
      <div class="ruth-view">
        <div class="panel ruth-hero">
          <div>
            <span class="eyebrow">AQA 3.8.1.1 · Nuclear Physics extension</span>
            <h2>Rutherford alpha-scattering experiment</h2>
            <p>Follow the real experimental logic: send alpha particles at very thin gold foil, observe where they go, then use those observations to infer the structure of the atom.</p>
          </div>
          <div class="ruth-controls">
            <button class="button primary" id="ruthFireOne">Fire one α</button>
            <button class="button" id="ruthFireBeam">Fire beam</button>
            <button class="button" id="ruthPause">Pause</button>
            <button class="button" id="ruthReset">Reset</button>
          </div>
        </div>

        <div class="ruth-layout">
          <div class="panel ruth-stage">
            <div class="ruth-canvas-wrap">
              <canvas id="rutherfordExperimentCanvas" aria-label="Interactive Rutherford alpha scattering experiment"></canvas>
              <span class="ruth-stage-label" id="ruthStageLabel">Apparatus view</span>
              <div class="ruth-legend">
                <span>α = helium nucleus, +2e</span>
                <span>Au foil = thin target</span>
                <span>screen = scintillation detector</span>
              </div>
            </div>
            <div class="ruth-controls">
              <button class="button active" data-ruth-mode="apparatus">Apparatus</button>
              <button class="button" data-ruth-mode="closeup">Nuclear close-up</button>
            </div>
            <p class="model-note">The apparatus layout and track sizes are schematic. The close-up uses the classical Coulomb-scattering relation to show the correct trends with impact parameter, nuclear charge and alpha-particle energy.</p>
          </div>

          <aside class="ruth-side">
            <div class="panel ruth-card">
              <span class="eyebrow">What am I looking at?</span>
              <h3>The experimental apparatus</h3>
              <div class="ruth-apparatus">
                <div><span class="ruth-number">1</span><span><strong>Alpha source</strong>Produces positively charged helium nuclei.</span></div>
                <div><span class="ruth-number">2</span><span><strong>Lead collimator</strong>A narrow slit makes a directed beam.</span></div>
                <div><span class="ruth-number">3</span><span><strong>Thin gold foil</strong>Thin foil reduces repeated scattering through many atoms.</span></div>
                <div><span class="ruth-number">4</span><span><strong>Fluorescent screen</strong>Alpha impacts create tiny flashes that reveal scattering direction.</span></div>
              </div>
            </div>

            <div class="panel ruth-card">
              <h3>What should I notice?</h3>
              <div class="ruth-observation-grid">
                <div class="ruth-observation"><span>Beam particles fired</span><strong id="ruthFired">0</strong></div>
                <div class="ruth-observation"><span>Little / no deflection</span><strong id="ruthStraight">0</strong></div>
                <div class="ruth-observation"><span>Large deflection</span><strong id="ruthLarge">0</strong></div>
              </div>
              <p class="small subtle">Counts are an illustrative teaching sample, not a prediction of exact experimental frequencies.</p>
            </div>

            <div class="panel ruth-card">
              <h3>The science in one sentence</h3>
              <p class="ruth-insight"><strong>Rare large-angle deflections can only be explained if most positive charge and mass are concentrated in a tiny nucleus, while most of the atom is empty space.</strong></p>
            </div>

            <div class="panel ruth-card" id="ruthCloseControls" hidden>
              <h3>Change the close encounter</h3>
              <div class="ruth-mode-grid">
                <div class="ruth-field">
                  <label for="ruthImpact">Impact parameter b</label>
                  <input id="ruthImpact" type="range" min="5" max="220" value="55" step="1">
                  <div class="small subtle"><span id="ruthImpactVal">55</span> fm</div>
                </div>
                <div class="ruth-field">
                  <label for="ruthEnergy">Alpha kinetic energy</label>
                  <input id="ruthEnergy" type="range" min="3" max="8" value="5.5" step="0.1">
                  <div class="small subtle"><span id="ruthEnergyVal">5.5</span> MeV</div>
                </div>
              </div>
              <div class="ruth-readout" id="ruthAngleReadout"></div>
            </div>
          </aside>
        </div>

        <div class="panel ruth-card">
          <div class="section-head">
            <div><span class="eyebrow">Observation → inference</span><h2>How the experiment changed the atomic model</h2></div>
            <p class="subtle">This reasoning is the key part to learn for AQA.</p>
          </div>
          <div class="ruth-evidence">
            <div class="ruth-evidence-row"><strong>Observation</strong><strong>What it tells us</strong><strong>Conclusion</strong></div>
            <div class="ruth-evidence-row"><span>Most alpha particles pass straight through.</span><span>They encounter very little matter or concentrated charge.</span><span>The atom is mostly empty space.</span></div>
            <div class="ruth-evidence-row"><span>Some are deflected through small angles.</span><span>Positive alpha particles are repelled by a positive region.</span><span>Positive charge is concentrated rather than spread through the atom.</span></div>
            <div class="ruth-evidence-row"><span>A very small number are deflected through very large angles or backwards.</span><span>A strong repulsive force acts only when an alpha passes very close to a very small region.</span><span>Most positive charge and mass are concentrated in a tiny, dense nucleus.</span></div>
          </div>
        </div>

        <div class="ruth-steps">
          <article class="ruth-step"><span class="eyebrow">Step 1</span><h4>Make the beam</h4><p>An alpha source sits inside shielding. A slit produces a narrow beam directed towards the foil.</p></article>
          <article class="ruth-step"><span class="eyebrow">Step 2</span><h4>Use very thin foil</h4><p>Gold can be made extremely thin, helping individual scattering events dominate the interpretation.</p></article>
          <article class="ruth-step"><span class="eyebrow">Step 3</span><h4>Detect the particles</h4><p>A zinc-sulfide style scintillation screen reveals where alpha particles arrive by producing tiny flashes.</p></article>
          <article class="ruth-step"><span class="eyebrow">Step 4</span><h4>Compare directions</h4><p>Most continue almost straight; some turn; a tiny number reverse direction.</p></article>
          <article class="ruth-step"><span class="eyebrow">Step 5</span><h4>Reject the old picture</h4><p>A diffuse positive “plum pudding” model could not account for rare very large deflections.</p></article>
          <article class="ruth-step"><span class="eyebrow">Step 6</span><h4>Build the nuclear model</h4><p>The evidence supports a tiny, dense, positively charged nucleus surrounded by mostly empty space.</p></article>
        </div>

        <div class="panel ruth-card">
          <div class="ruth-plum"><strong>Historical note:</strong> the famous scattering measurements were carried out by Hans Geiger and Ernest Marsden while working with Ernest Rutherford. Rutherford used the results to develop the nuclear model of the atom.</div>
        </div>
      </div>`;

    main.appendChild(section);

    function show() {
      $$('.view').forEach(v => v.classList.toggle('active-view', v === section));
      $$('.nav-button').forEach(b => b.classList.toggle('active', b === navButton));
      resizeCanvas();
      draw();
    }
    navButton.addEventListener('click', show);

    $$('.nav-button').filter(b => b !== navButton).forEach(b => {
      b.addEventListener('click', () => section.classList.remove('active-view'));
    });

    bindControls();
    injectLabLauncher();
  }

  function injectLabLauncher() {
    const side = $('.lab-side');
    if (!side || $('#ruthLabLauncher')) return;
    const box = document.createElement('div');
    box.id = 'ruthLabLauncher';
    box.className = 'ruth-launch-card';
    box.style.display = 'none';
    box.innerHTML = '<h3>Run the full Rutherford experiment</h3><p>See the source, collimator, gold foil, detector, observations and the evidence for the nuclear model.</p><button class="button primary" id="openRuthFull">Open full experiment</button>';
    side.prepend(box);
    $('#openRuthFull').onclick = () => $('[data-view="rutherfordexp"]')?.click();

    const refresh = () => {
      const active = $('.sim-tab.active')?.dataset.sim;
      box.style.display = active === 'rutherford' ? 'block' : 'none';
    };
    const nav = $('#simNav');
    if (nav) {
      nav.addEventListener('click', () => setTimeout(refresh, 0));
      new MutationObserver(refresh).observe(nav, {subtree:true, attributes:true, attributeFilter:['class'], childList:true});
    }
    refresh();
  }

  function bindControls() {
    $('#ruthFireOne')?.addEventListener('click', () => fire(1));
    $('#ruthFireBeam')?.addEventListener('click', () => fire(70));
    $('#ruthPause')?.addEventListener('click', () => {
      running = !running;
      $('#ruthPause').textContent = running ? 'Pause' : 'Resume';
      if (running) animate();
    });
    $('#ruthReset')?.addEventListener('click', reset);

    $$('[data-ruth-mode]').forEach(btn => btn.addEventListener('click', () => {
      mode = btn.dataset.ruthMode;
      $$('[data-ruth-mode]').forEach(x => x.classList.toggle('active', x === btn));
      $('#ruthStageLabel').textContent = mode === 'apparatus' ? 'Apparatus view' : 'Single-nucleus close-up';
      $('#ruthCloseControls').hidden = mode !== 'closeup';
      particles = [];
      draw();
    }));

    $('#ruthImpact')?.addEventListener('input', e => {
      impactFm = Number(e.target.value);
      $('#ruthImpactVal').textContent = impactFm.toFixed(0);
      updateAngle();
      draw();
    });
    $('#ruthEnergy')?.addEventListener('input', e => {
      energyMeV = Number(e.target.value);
      $('#ruthEnergyVal').textContent = energyMeV.toFixed(1);
      updateAngle();
      draw();
    });
    window.addEventListener('resize', resizeCanvas);
    updateAngle();
  }

  function updateAngle() {
    const theta = scatterAngle(impactFm, energyMeV);
    const el = $('#ruthAngleReadout');
    if (!el) return;
    el.innerHTML = `θ ≈ <strong>${theta.toFixed(1)}°</strong><br><span class="subtle">smaller b → closer approach → larger repulsive impulse → larger scattering angle</span>`;
  }

  function scatterAngle(bFm, energy) {
    const E = energy * 1e6 * E_CHARGE;
    const b = Math.max(0.1, bFm) * 1e-15;
    const ratio = K * Z_GOLD * Z_ALPHA * E_CHARGE * E_CHARGE / (2 * E * b);
    return 2 * Math.atan(ratio) * 180 / Math.PI;
  }

  function resizeCanvas() {
    const canvas = $('#rutherfordExperimentCanvas');
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(320, Math.round(rect.width || 800));
    const h = Math.max(300, Math.round(rect.height || 520));
    if (canvas.width !== Math.round(w*dpr) || canvas.height !== Math.round(h*dpr)) {
      canvas.width = Math.round(w*dpr);
      canvas.height = Math.round(h*dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
  }

  function reset() {
    particles = [];
    counts = { fired:0, straight:0, small:0, large:0 };
    running = false;
    cancelAnimationFrame(animationId);
    $('#ruthPause').textContent = 'Pause';
    updateCounts();
    draw();
  }

  function fire(n) {
    if (mode === 'closeup') {
      particles = [{t:0, type:'close'}];
      running = true;
      animate();
      return;
    }
    for (let i=0;i<n;i++) {
      const r = Math.random();
      let angle;
      if (r < 0.88) angle = (Math.random()-.5)*2.5;
      else if (r < 0.985) angle = (Math.random() < .5 ? -1 : 1) * (4 + Math.random()*22);
      else angle = (Math.random() < .5 ? -1 : 1) * (55 + Math.random()*100);
      const category = Math.abs(angle) < 3 ? 'straight' : Math.abs(angle) < 35 ? 'small' : 'large';
      particles.push({t:0, angle, category, lane:(Math.random()-.5)*18});
      counts.fired++;
      counts[category]++;
    }
    updateCounts();
    running = true;
    $('#ruthPause').textContent = 'Pause';
    animate();
  }

  function updateCounts() {
    if ($('#ruthFired')) $('#ruthFired').textContent = counts.fired;
    if ($('#ruthStraight')) $('#ruthStraight').textContent = counts.straight;
    if ($('#ruthLarge')) $('#ruthLarge').textContent = counts.large;
  }

  function animate() {
    if (!running) return;
    particles.forEach(p => p.t += mode === 'closeup' ? 0.008 : 0.013);
    particles = particles.filter(p => p.t < 1.08);
    draw();
    if (particles.length) animationId = requestAnimationFrame(animate);
    else running = false;
  }

  function draw() {
    const canvas = $('#rutherfordExperimentCanvas');
    if (!canvas) return;
    resizeCanvas();
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || 800, h = rect.height || 520;
    ctx.clearRect(0,0,w,h);
    drawGrid(ctx,w,h);
    if (mode === 'closeup') drawCloseup(ctx,w,h);
    else drawApparatus(ctx,w,h);
  }

  function drawGrid(ctx,w,h) {
    ctx.save();
    ctx.globalAlpha=.08;
    ctx.strokeStyle='#8ecfff';
    ctx.lineWidth=1;
    for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
    for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
    ctx.restore();
  }

  function roundRect(ctx,x,y,w,h,r,fill,stroke) {
    ctx.beginPath();
    ctx.roundRect(x,y,w,h,r);
    if(fill){ctx.fillStyle=fill;ctx.fill();}
    if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
  }

  function label(ctx,text,x,y,align='center') {
    ctx.fillStyle='#eaf5ff';
    ctx.font='700 13px system-ui, sans-serif';
    ctx.textAlign=align;
    ctx.fillText(text,x,y);
  }

  function drawApparatus(ctx,w,h) {
    const cy=h*.52;
    const sourceX=w*.09, slitX=w*.23, foilX=w*.55, detectorX=w*.86;

    roundRect(ctx,sourceX-36,cy-45,72,90,14,'#273747','#5b7690');
    ctx.fillStyle='#ffd56a'; ctx.beginPath(); ctx.arc(sourceX,cy,12,0,Math.PI*2); ctx.fill();
    label(ctx,'α source',sourceX,cy+70);

    roundRect(ctx,slitX-25,cy-70,50,140,8,'#38485a','#7d91a5');
    ctx.clearRect(slitX-28,cy-8,56,16);
    label(ctx,'lead collimator',slitX,cy+92);

    ctx.strokeStyle='#67c7ff'; ctx.lineWidth=2; ctx.setLineDash([7,6]);
    ctx.beginPath();ctx.moveTo(sourceX+15,cy);ctx.lineTo(foilX-12,cy);ctx.stroke();ctx.setLineDash([]);

    ctx.strokeStyle='#f1d77a';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(foilX,cy-105);ctx.lineTo(foilX,cy+105);ctx.stroke();
    label(ctx,'very thin gold foil',foilX,cy+130);

    ctx.strokeStyle='#82e4b2';ctx.lineWidth=7;
    ctx.beginPath();ctx.arc(foilX,cy,w*.31,-1.1,1.1);ctx.stroke();
    label(ctx,'fluorescent detector screen',detectorX,cy+145);

    particles.forEach(p=>{
      const t=Math.min(1,p.t);
      let x,y;
      if(t<.58){
        const q=t/.58;
        x=sourceX+18+(foilX-sourceX-18)*q;
        y=cy+p.lane*(1-q);
      } else {
        const q=(t-.58)/.42;
        const a=p.angle*Math.PI/180;
        const len=w*.36*q;
        x=foilX+Math.cos(a)*len;
        y=cy+Math.sin(a)*len;
      }
      ctx.fillStyle=p.category==='large'?'#ff9a9a':p.category==='small'?'#ffd56a':'#7ee8ff';
      ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();

      ctx.strokeStyle=ctx.fillStyle;ctx.globalAlpha=.35;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(sourceX+18,cy+p.lane);
      ctx.lineTo(foilX,cy);
      if(t>.58){
        const a=p.angle*Math.PI/180;
        ctx.lineTo(foilX+Math.cos(a)*w*.36,cy+Math.sin(a)*w*.36);
      }
      ctx.stroke();ctx.globalAlpha=1;
    });

    label(ctx,'Most pass through almost straight',w*.45,44);
    ctx.fillStyle='#aabbd1';ctx.font='12px system-ui';ctx.textAlign='center';
    ctx.fillText('Some deflect • very few scatter through large angles',w*.55,64);
  }

  function drawCloseup(ctx,w,h) {
    const cx=w*.56, cy=h*.5;
    const theta=scatterAngle(impactFm,energyMeV);
    const bPx=Math.min(h*.32, impactFm/220*h*.32 + 7);
    const startX=w*.08, startY=cy-bPx;
    const turnX=cx-w*.08;

    ctx.save();
    const glow=ctx.createRadialGradient(cx,cy,5,cx,cy,75);
    glow.addColorStop(0,'rgba(255,190,90,.75)');
    glow.addColorStop(1,'rgba(255,190,90,0)');
    ctx.fillStyle=glow;ctx.beginPath();ctx.arc(cx,cy,75,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#ffbf68';ctx.beginPath();ctx.arc(cx,cy,25,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffe3a8';ctx.lineWidth=2;ctx.stroke();
    label(ctx,'Au nucleus (+79e)',cx,cy+53);

    ctx.strokeStyle='rgba(255,123,135,.25)';ctx.setLineDash([6,7]);
    [55,95,135].forEach(r=>{ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();});
    ctx.setLineDash([]);

    const def = Math.min(160,theta) * Math.PI/180;
    const outAngle = -def * .72;
    const p={t: particles[0]?.t ?? 1};
    const t=Math.min(1,p.t);
    let x,y;
    if(t<.55){
      const q=t/.55;
      x=startX+(turnX-startX)*q;
      y=startY;
    }else{
      const q=(t-.55)/.45;
      x=turnX+Math.cos(outAngle)*w*.43*q;
      y=startY+Math.sin(outAngle)*w*.43*q;
    }
    ctx.strokeStyle='#7ee8ff';ctx.lineWidth=3;
    ctx.beginPath();ctx.moveTo(startX,startY);ctx.lineTo(turnX,startY);ctx.lineTo(turnX+Math.cos(outAngle)*w*.43,startY+Math.sin(outAngle)*w*.43);ctx.stroke();
    ctx.fillStyle='#7ee8ff';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();

    ctx.strokeStyle='#b8dfff';ctx.lineWidth=1;ctx.setLineDash([4,5]);
    ctx.beginPath();ctx.moveTo(startX,cy);ctx.lineTo(turnX,cy);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#b8dfff';ctx.beginPath();ctx.moveTo(startX,cy);ctx.lineTo(startX,startY);ctx.stroke();
    ctx.fillStyle='#b8dfff';ctx.font='12px system-ui';ctx.textAlign='left';
    ctx.fillText(`impact parameter b = ${impactFm.toFixed(0)} fm`,startX+8,(cy+startY)/2);

    ctx.fillStyle='#eaf5ff';ctx.font='700 15px system-ui';ctx.textAlign='left';
    ctx.fillText(`Calculated scattering angle θ ≈ ${theta.toFixed(1)}°`,20,36);
    ctx.fillStyle='#aabbd1';ctx.font='12px system-ui';
    ctx.fillText('Decrease b or energy → stronger deflection. Increase nuclear charge → stronger deflection.',20,56);
    ctx.restore();
  }

  function init() {
    addView();
    setTimeout(() => {
      resizeCanvas();
      draw();
      injectLabLauncher();
    }, 120);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
