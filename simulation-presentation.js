
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const profiles = {
    atom:{
      focus:'Nucleus ↔ electron region',
      change:'Change isotope and electron count',
      watch:'Z fixes the element; A changes with neutrons'
    },
    specific:{
      focus:'Charge divided by total mass',
      change:'Change Z, A and electrons',
      watch:'Large |Q| and small m give large |Q/m|'
    },
    strong:{
      focus:'Force changes with separation',
      change:'Move the two nucleons',
      watch:'Repulsive very close; attractive over nuclear range'
    },
    decay:{
      focus:'Parent → emitted particles → daughter',
      change:'Switch α, β⁻ and β⁺',
      watch:'Track how A and Z change'
    },
    antimatter:{
      focus:'Matter ↔ antimatter ↔ photons',
      change:'Run annihilation or pair production',
      watch:'Energy and momentum must both be conserved'
    },
    interactions:{
      focus:'Incoming → exchange → outgoing',
      change:'Switch interaction process',
      watch:'Identify the exchange particle and conserved quantities'
    },
    classification:{
      focus:'Hadron, baryon, meson or lepton',
      change:'Select a particle family',
      watch:'Strong interaction separates hadrons from leptons'
    },
    quarks:{
      focus:'Add quark quantum numbers',
      change:'Build different hadrons',
      watch:'Charge, baryon number and strangeness must add correctly'
    },
    photo:{
      focus:'Photon energy vs work function',
      change:'Frequency, intensity and φ',
      watch:'Below threshold: no emission; above: KEmax rises with f'
    },
    collisions:{
      focus:'Electron energy transfer',
      change:'Incident energy and atom',
      watch:'No change → excitation → ionisation'
    },
    levels:{
      focus:'Discrete energy-level transition',
      change:'Choose the transition',
      watch:'Photon energy equals the level difference'
    },
    diffraction:{
      focus:'Electron wavelength and diffraction',
      change:'Accelerating voltage / momentum',
      watch:'Higher p → shorter λ → tighter pattern'
    },
    rutherford:{
      focus:'Impact parameter and Coulomb repulsion',
      change:'b, nuclear charge and alpha energy',
      watch:'Closer approach gives a larger deflection'
    }
  };

  function currentSim(){
    return $('#simNav .sim-tab.active')?.dataset.sim || 'atom';
  }

  function addKeyStrip(){
    const side=$('.lab-side');
    if(!side || $('#simKeyStrip')) return;
    const strip=document.createElement('div');
    strip.id='simKeyStrip';
    strip.className='sim-key-strip';
    strip.innerHTML=
      '<div class="sim-key-item"><span>Focus</span><strong id="simKeyFocus"></strong></div>'+
      '<div class="sim-key-item"><span>Change</span><strong id="simKeyChange"></strong></div>'+
      '<div class="sim-key-item"><span>Watch for</span><strong id="simKeyWatch"></strong></div>';
    const readout=$('#simReadout');
    if(readout) readout.insertAdjacentElement('afterend',strip);
    else side.prepend(strip);
  }

  function add3DBadge(){
    const wrap=$('.viewer-wrap');
    if(!wrap || $('#sim3DStatusBadge')) return;
    const b=document.createElement('div');
    b.id='sim3DStatusBadge';
    b.className='sim-corner-badge';
    b.textContent='Interactive 3D model';
    wrap.appendChild(b);
  }

  function updateProfile(){
    const p=profiles[currentSim()] || profiles.atom;
    if($('#simKeyFocus')) $('#simKeyFocus').textContent=p.focus;
    if($('#simKeyChange')) $('#simKeyChange').textContent=p.change;
    if($('#simKeyWatch')) $('#simKeyWatch').textContent=p.watch;
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  function physicsMarkup(text){
    let s=escapeHtml(text);
    const reps = [
      [/\bKEmax\b/g,'KE<sub>max</sub>'],
      [/\bVs\b/g,'V<sub>s</sub>'],
      [/\bf0\b/g,'f<sub>0</sub>'],
      [/\bNe\b/g,'N<sub>e</sub>'],
      [/\bme\b/g,'m<sub>e</sub>'],
      [/\bmp\b/g,'m<sub>p</sub>'],
      [/\bmn\b/g,'m<sub>n</sub>'],
      [/C kg⁻¹/g,'<span class="physics-unit">C kg⁻¹</span>'],
      [/10⁻¹⁹/g,'10<sup>−19</sup>'],
      [/10⁻²⁷/g,'10<sup>−27</sup>'],
      [/10⁻³¹/g,'10<sup>−31</sup>']
    ];
    for(const [re,to] of reps) s=s.replace(re,to);
    const looksMath=/[=≈λφθΔ±×÷]|(?:\b[AQEZBSpfhmcV]\b)/.test(text);
    return looksMath ? '<span class="physics-math">'+s+'</span>' : s;
  }

  let formatting=false;
  function formatReadout(){
    const box=$('#simReadout');
    if(!box || formatting) return;
    const raw=(box.textContent || '').replace(/\s+/g,' ').trim();
    if(!raw) return;
    if(box.dataset.formattedRaw===raw && box.querySelector('.sim-readout-flow')) return;
    formatting=true;
    const pieces=raw.split(/\s*[·•]\s*/).map(x=>x.trim()).filter(Boolean);
    const use=pieces.length ? pieces : [raw];
    box.innerHTML='<div class="sim-readout-flow">'+use.map(x=>'<span class="sim-readout-chip">'+physicsMarkup(x)+'</span>').join('')+'</div>';
    box.dataset.formattedRaw=raw;
    formatting=false;
  }

  function formatLearningText(){
    const targets=[
      ['#simpleExplain','Key idea'],
      ['#examExplain','Exam wording'],
      ['#mistakeExplain','Avoid this']
    ];
    for(const [sel] of targets){
      const el=$(sel);
      if(!el) continue;
      el.querySelectorAll('p').forEach(p=>{
        p.style.margin='0';
      });
    }
  }

  function refresh(){
    addKeyStrip();
    add3DBadge();
    updateProfile();
    formatLearningText();
    setTimeout(formatReadout,0);
  }

  function init(){
    refresh();

    const readout=$('#simReadout');
    if(readout){
      const observer=new MutationObserver(()=>{
        if(!formatting) queueMicrotask(formatReadout);
      });
      observer.observe(readout,{childList:true,subtree:true,characterData:true});
    }

    $('#simNav')?.addEventListener('click',e=>{
      if(e.target.closest?.('.sim-tab')) setTimeout(refresh,35);
    });

    document.addEventListener('input',e=>{
      if(e.target.closest?.('#simControls')) setTimeout(formatReadout,30);
    });
    document.addEventListener('change',e=>{
      if(e.target.closest?.('#simControls')) setTimeout(formatReadout,30);
    });
    document.addEventListener('click',e=>{
      if(e.target.closest?.('#simControls button')) setTimeout(formatReadout,60);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
