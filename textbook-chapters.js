(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const zh=()=>String(document.documentElement.lang||'').toLowerCase().startsWith('zh');
  const tr=(en,cn)=>zh()?cn:en;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

  const misconceptions={
    1:['Isotopes do not have different proton numbers. Changing Z changes the element; changing neutron number changes the isotope.','同位素并不是质子数不同。改变 Z 会改变元素；改变中子数才会改变同位素。'],
    2:['Specific charge is not the charge of one proton. It is the net charge of the whole particle divided by its total mass.','比荷不是“一个质子的电荷”，而是整个粒子的净电荷除以总质量。'],
    3:['The strong nuclear force is not simply attractive at every separation. It becomes repulsive at extremely short distance and negligible beyond a few femtometres.','强核力并非在所有距离都吸引。极短距离时会排斥，超过几飞米后可忽略。'],
    4:['The beta electron is created during beta decay; it is not an orbital electron that was already sitting inside the nucleus.','β 电子是在 β 衰变过程中产生的，并不是原先存在于原子核中的轨道电子。'],
    5:['An antiparticle is not defined only by opposite charge. Neutral particles can have distinct antiparticles too.','反粒子不能只用“电荷相反”定义；中性粒子也可以有不同的反粒子。'],
    6:['Pair production cannot be treated as one photon turning into a pair in otherwise empty space while ignoring momentum. A nearby body can take recoil momentum.','成对产生不能理解成单个光子在完全空旷空间里直接变成粒子对而忽略动量；附近物体可以承担反冲动量。'],
    7:['Exchange-particle diagrams are models of an interaction, not photographs of tiny visible particles travelling along drawn tracks.','交换粒子图是相互作用模型，并不是微小可见粒子沿图中轨迹运动的照片。'],
    8:['“Hadron” and “baryon” are not interchangeable. Baryons and mesons are both hadrons.','“强子”和“重子”不能互换；重子和介子都属于强子。'],
    9:['Do not reverse the strange-quark sign: s has S = −1, while anti-s has S = +1.','不要弄反奇异夸克的奇异数：s 的 S = −1，而反 s 的 S = +1。'],
    10:['A reaction is not allowed just because electric charge is conserved. You must check every relevant conservation law.','不能只因为电荷守恒就认为反应允许；必须检查所有相关守恒定律。'],
    11:['Increasing light intensity does not increase the energy of each photon when frequency is unchanged.','频率不变时，提高光强不会增加单个光子的能量。'],
    12:['Excitation and ionisation are different: excitation leaves the electron bound; ionisation removes it from the atom.','激发与电离不同：激发后电子仍被束缚；电离会把电子完全移出原子。'],
    13:['Energy-level lines are allowed energies, not literal electron paths or physical shelves inside the atom.','能级线表示允许的能量，并不是电子真实运动路径或原子内部的物理“层板”。'],
    14:['Wave–particle duality does not mean an electron switches between being a classical ball and a classical water wave.','波粒二象性并不表示电子在“经典小球”和“经典水波”之间切换。'],
    15:['Synoptic questions are not solved by memorising isolated facts. Link classification, equations, interactions and conservation logically.','综合题不能只靠记忆孤立事实；要把分类、方程、相互作用和守恒规律逻辑连接起来。'],
    16:['Most alpha particles passing through does not mean the foil contains no matter. It means the nucleus occupies a tiny fraction of atomic volume.','大多数 α 粒子直穿并不表示金箔“没有物质”，而是说明原子核只占原子总体积的极小部分。']
  };

  const photos={
    1:{
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Atom1.png',
      page:'https://commons.wikimedia.org/wiki/File:Atom1.png',
      credit:'Bensaccount / Wikimedia Commons',license:'Public domain',
      en:'Electron-cloud-style representation of a helium atom. The nucleus is enlarged so its structure can be seen.',
      zh:'氦原子的电子云式表示。原子核被放大，以便观察其内部结构。'
    },
    13:{
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hydrogen%20spectrum%20visible.png',
      page:'https://commons.wikimedia.org/wiki/File:Hydrogen_spectrum_visible.png',
      credit:'McZusatz / Wikimedia Commons',license:'CC0',
      en:'Visible hydrogen emission spectrum. The separate bright wavelengths are evidence for discrete atomic energy changes.',
      zh:'可见氢原子发射光谱。分立的亮线说明原子的能量变化是离散的。'
    },
    14:{
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/ElectronDiffraction01.jpg',
      page:'https://commons.wikimedia.org/wiki/File:ElectronDiffraction01.jpg',
      credit:'And1mu / Wikimedia Commons',license:'CC BY-SA 4.0',
      en:'Real school electron-diffraction pattern from graphite. The rings are direct experimental evidence of wave-like electron behaviour.',
      zh:'石墨产生的真实学校电子衍射图样。环纹是电子具有波动性的直接实验证据。'
    },
    16:{
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rutherford%20Experiment.svg',
      page:'https://commons.wikimedia.org/wiki/File:Rutherford_Experiment.svg',
      credit:'Dombob / Wikimedia Commons',license:'CC0',
      en:'Open-licensed Rutherford scattering apparatus diagram showing the source, gold foil and detector geometry.',
      zh:'开放许可的卢瑟福散射装置图，展示粒子源、金箔和探测器的几何关系。'
    }
  };

  const diagramTitle={
    1:['Atomic structure and nuclide notation','原子结构与核素表示法'],
    2:['Specific charge: charge divided by mass','比荷：电荷除以质量'],
    3:['Strong nuclear force vs separation','强核力随距离变化'],
    4:['Alpha and beta-minus decay','α 衰变与 β⁻ 衰变'],
    5:['Photons and particle–antiparticle pairs','光子与粒子—反粒子对'],
    6:['Annihilation and pair production','湮灭与成对产生'],
    7:['Exchange-particle interaction model','交换粒子相互作用模型'],
    8:['Particle classification tree','粒子分类树'],
    9:['Quark structure of selected hadrons','常见强子的夸克结构'],
    10:['Conservation-law ledger','守恒定律检查表'],
    11:['Photoelectric effect energy flow','光电效应能量关系'],
    12:['Electron collisions: excitation vs ionisation','电子碰撞：激发与电离'],
    13:['Energy levels, photons and line spectra','能级、光子与线状光谱'],
    14:['Electron diffraction and de Broglie wavelength','电子衍射与德布罗意波长'],
    15:['Synoptic map of Particles & Radiation','粒子与辐射综合知识图'],
    16:['Rutherford scattering evidence','卢瑟福散射证据']
  };

  function svg(inner){return `<svg viewBox="0 0 620 300" role="img" aria-label="${esc(tr(...diagramTitle[currentLessonNumber()]||['Physics diagram','物理图示']))}">${inner}</svg>`}
  function txt(x,y,en,cn,cls='svg-label',anchor='start'){return `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(tr(en,cn))}</text>`}
  function line(x1,y1,x2,y2,cls='svg-line'){return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`}
  function circle(cx,cy,r,cls='svg-node'){return `<circle cx="${cx}" cy="${cy}" r="${r}" class="${cls}"/>`}
  function rect(x,y,w,h,cls='svg-node',rx=10){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`}

  function diagram(n){
    switch(n){
      case 1:return svg(`${circle(180,150,55)}${circle(180,150,20,'svg-node2')}${circle(180,150,105,'svg-soft')}${circle(275,118,9,'svg-node3')}${txt(180,155,'nucleus','原子核','svg-label','middle')}${txt(275,100,'electron','电子','svg-small','middle')}${rect(380,78,170,115,'svg-node3')}${txt(465,112,'nuclide notation','核素表示法','svg-label','middle')}${txt(465,150,'ᴬ','A','svg-equation','middle')}${txt(490,150,'X','X','svg-equation','middle')}${txt(465,174,'Z','Z','svg-equation','middle')}${txt(465,215,'N = A − Z','N = A − Z','svg-equation','middle')}`);
      case 2:return svg(`${circle(145,125,34)}${txt(145,131,'Q','Q','svg-equation','middle')}${line(215,80,215,180)}${txt(215,66,'specific charge','比荷','svg-label','middle')}${txt(315,115,'Q','Q','svg-equation','middle')}${line(280,132,350,132)}${txt(315,160,'m','m','svg-equation','middle')}${txt(450,98,'large |Q|','|Q| 大','svg-small','middle')}${txt(450,128,'+','+','svg-label','middle')}${txt(450,158,'small m','m 小','svg-small','middle')}${txt(450,205,'→ large |Q/m|','→ |Q/m| 大','svg-label','middle')}`);
      case 3:return svg(`${line(80,245,555,245)}${line(80,245,80,50)}<path d="M90 65 C115 150 145 220 195 200 C260 175 335 150 390 190 C440 220 505 235 555 238" class="svg-line"/>${line(155,48,155,245,'svg-soft')}${line(390,48,390,245,'svg-soft')}${txt(155,265,'≈0.5 fm','≈0.5 fm','svg-small','middle')}${txt(390,265,'≈3 fm','≈3 fm','svg-small','middle')}${txt(132,88,'repulsive','排斥','svg-label','middle')}${txt(285,148,'attractive','吸引','svg-label','middle')}${txt(480,210,'negligible','可忽略','svg-label','middle')}${txt(318,288,'separation','距离','svg-small','middle')}`);
      case 4:return svg(`${rect(55,58,150,78,'svg-node2')}${txt(130,92,'parent nucleus','母核','svg-label','middle')}${txt(130,118,'A, Z','A, Z','svg-equation','middle')}${line(205,95,330,95,'svg-accent')}${txt(270,78,'α','α','svg-equation','middle')}${rect(350,58,160,78,'svg-node')}${txt(430,92,'daughter','子核','svg-label','middle')}${txt(430,118,'A−4, Z−2','A−4, Z−2','svg-equation','middle')}${rect(55,180,150,65,'svg-node2')}${txt(130,218,'n → p','n → p','svg-equation','middle')}${line(205,210,360,210,'svg-line')}${txt(285,190,'β⁻','β⁻','svg-equation','middle')}${txt(415,205,'e⁻ + ν̄ₑ','e⁻ + ν̄ₑ','svg-equation','middle')}${txt(415,232,'A same, Z + 1','A 不变，Z + 1','svg-small','middle')}`);
      case 5:return svg(`${circle(120,130,30)}${circle(240,130,30,'svg-node3')}${txt(120,137,'e⁻','e⁻','svg-equation','middle')}${txt(240,137,'e⁺','e⁺','svg-equation','middle')}${txt(180,80,'same mass','质量相同','svg-label','middle')}${txt(180,180,'opposite charge','电荷相反','svg-small','middle')}<path d="M360 145 q25 -50 50 0 t50 0 t50 0" class="svg-accent"/>${txt(435,90,'photon','光子','svg-label','middle')}${txt(435,205,'E = hf = hc/λ','E = hf = hc/λ','svg-equation','middle')}`);
      case 6:return svg(`${txt(160,45,'annihilation','湮灭','svg-label','middle')}${circle(95,110,24)}${circle(225,110,24,'svg-node3')}${txt(95,116,'e⁻','e⁻','svg-equation','middle')}${txt(225,116,'e⁺','e⁺','svg-equation','middle')}${line(120,110,155,110)}${line(200,110,165,110)}${line(160,120,80,180,'svg-accent')}${line(160,120,240,180,'svg-accent')}${txt(64,198,'γ','γ','svg-equation','middle')}${txt(256,198,'γ','γ','svg-equation','middle')}${txt(455,45,'pair production','成对产生','svg-label','middle')}<path d="M350 100 q20 -38 40 0 t40 0" class="svg-accent"/>${line(430,100,485,75)}${line(430,100,485,135)}${circle(510,72,22)}${circle(510,138,22,'svg-node3')}${txt(510,78,'e⁻','e⁻','svg-equation','middle')}${txt(510,144,'e⁺','e⁺','svg-equation','middle')}${txt(455,215,'threshold: 1.022 MeV','阈能：1.022 MeV','svg-small','middle')}`);
      case 7:return svg(`${txt(310,42,'interaction model','相互作用模型','svg-label','middle')}${line(95,70,255,140)}${line(95,220,255,150)}${line(365,140,525,70)}${line(365,150,525,220)}${line(255,145,365,145,'svg-warn')}${circle(255,145,7,'svg-node2')}${circle(365,145,7,'svg-node2')}${txt(310,128,'γ / W','γ / W','svg-equation','middle')}${txt(105,58,'incoming','入射','svg-small')}${txt(475,58,'outgoing','出射','svg-small')}${txt(310,190,'exchange particle','交换粒子','svg-small','middle')}`);
      case 8:return svg(`${rect(250,25,120,45,'svg-node3')}${txt(310,53,'particles','粒子','svg-label','middle')}${line(310,70,180,115)}${line(310,70,440,115)}${rect(105,115,150,45,'svg-node')}${rect(365,115,150,45,'svg-node2')}${txt(180,143,'hadrons','强子','svg-label','middle')}${txt(440,143,'leptons','轻子','svg-label','middle')}${line(180,160,115,205)}${line(180,160,245,205)}${rect(55,205,125,45,'svg-node')}${rect(190,205,125,45,'svg-node')}${txt(117,233,'baryons','重子','svg-small','middle')}${txt(252,233,'mesons','介子','svg-small','middle')}${txt(440,215,'e⁻, μ⁻, ν','e⁻, μ⁻, ν','svg-equation','middle')}`);
      case 9:return svg(`${rect(55,55,225,80,'svg-node')}${txt(167,83,'proton','质子','svg-label','middle')}${txt(167,115,'u   u   d','u   u   d','svg-equation','middle')}${rect(340,55,225,80,'svg-node2')}${txt(452,83,'neutron','中子','svg-label','middle')}${txt(452,115,'u   d   d','u   d   d','svg-equation','middle')}${rect(55,180,225,72,'svg-node3')}${txt(167,207,'π⁺','π⁺','svg-label','middle')}${txt(167,235,'u   d̄','u   d̄','svg-equation','middle')}${rect(340,180,225,72,'svg-node3')}${txt(452,207,'K⁺','K⁺','svg-label','middle')}${txt(452,235,'u   s̄','u   s̄','svg-equation','middle')}`);
      case 10:return svg(`${txt(310,38,'check before → after','检查反应前 → 反应后','svg-label','middle')}${rect(75,70,470,170,'svg-node')}${line(235,70,235,240,'svg-soft')}${line(390,70,390,240,'svg-soft')}${line(75,110,545,110,'svg-soft')}${line(75,145,545,145,'svg-soft')}${line(75,180,545,180,'svg-soft')}${line(75,215,545,215,'svg-soft')}${txt(155,96,'quantity','物理量','svg-small','middle')}${txt(312,96,'before','反应前','svg-small','middle')}${txt(467,96,'after','反应后','svg-small','middle')}${txt(155,134,'charge Q','电荷 Q','svg-small','middle')}${txt(155,169,'baryon B','重子数 B','svg-small','middle')}${txt(155,204,'lepton L','轻子数 L','svg-small','middle')}${txt(155,233,'strangeness S','奇异数 S','svg-small','middle')}${txt(312,268,'equal totals → allowed check continues','总量相等 → 继续检查','svg-small','middle')}`);
      case 11:return svg(`${rect(70,165,300,55,'svg-node2')}${txt(220,198,'metal surface','金属表面','svg-label','middle')}<path d="M80 70 q24 -40 48 0 t48 0" class="svg-accent"/>${txt(130,45,'photon hf','光子 hf','svg-small','middle')}${line(180,90,220,165,'svg-accent')}${line(240,165,320,90,'svg-line')}${circle(330,82,13)}${txt(355,78,'photoelectron','光电子','svg-small')}${txt(445,120,'hf = φ + KEmax','hf = φ + KEmax','svg-equation','middle')}${txt(445,165,'KEmax = eVs','KEmax = eVs','svg-equation','middle')}${txt(445,205,'threshold: hf₀ = φ','阈值：hf₀ = φ','svg-small','middle')}`);
      case 12:return svg(`${circle(135,150,62,'svg-node2')}${circle(135,150,17,'svg-node')}${txt(135,245,'atom','原子','svg-small','middle')}${circle(55,150,12,'svg-node3')}${line(68,150,105,150)}${txt(55,125,'e⁻','e⁻','svg-small','middle')}${line(135,90,135,55,'svg-accent')}${circle(135,45,10,'svg-node3')}${txt(225,75,'excitation','激发','svg-label')}${txt(225,100,'electron remains bound','电子仍被束缚','svg-small')}${line(180,160,320,160,'svg-warn')}${circle(350,160,12,'svg-node3')}${txt(380,155,'ionisation','电离','svg-label')}${txt(380,180,'electron removed','电子被移走','svg-small')}${txt(315,235,'1 eV = 1.602 × 10⁻¹⁹ J','1 eV = 1.602 × 10⁻¹⁹ J','svg-equation','middle')}`);
      case 13:return svg(`${line(85,245,300,245,'svg-soft')}${line(85,195,300,195,'svg-soft')}${line(85,135,300,135,'svg-soft')}${line(85,70,300,70,'svg-soft')}${line(210,75,210,190,'svg-accent')}<path d="M205 180 l5 15 l5 -15" class="svg-accent"/>${txt(235,125,'ΔE = hf','ΔE = hf','svg-equation')}${txt(85,265,'energy levels','能级','svg-small')}${rect(355,70,180,155,'svg-node')}${line(385,190,385,110,'svg-warn')}${line(425,190,425,135,'svg-accent')}${line(470,190,470,155,'svg-line')}${line(510,190,510,170,'svg-soft')}${txt(445,245,'line spectrum','线状光谱','svg-small','middle')}`);
      case 14:return svg(`${line(60,145,220,145)}${txt(90,125,'electron beam','电子束','svg-small')}${rect(220,90,22,110,'svg-node2',2)}${txt(231,220,'graphite','石墨','svg-small','middle')}${circle(430,145,35,'svg-soft')}${circle(430,145,65,'svg-soft')}${circle(430,145,95,'svg-soft')}${txt(430,270,'diffraction rings','衍射环','svg-label','middle')}${txt(320,55,'λ = h/p','λ = h/p','svg-equation','middle')}${txt(320,82,'p ↑ → λ ↓','p ↑ → λ ↓','svg-small','middle')}`);
      case 15:return svg(`${circle(310,145,55,'svg-node3')}${txt(310,140,'Particles &','粒子与','svg-label','middle')}${txt(310,160,'Radiation','辐射','svg-label','middle')}${rect(55,45,150,55,'svg-node')}${rect(415,45,150,55,'svg-node2')}${rect(55,205,150,55,'svg-node2')}${rect(415,205,150,55,'svg-node')}${txt(130,78,'particles','粒子','svg-label','middle')}${txt(490,78,'interactions','相互作用','svg-label','middle')}${txt(130,238,'quantum','量子现象','svg-label','middle')}${txt(490,238,'conservation','守恒','svg-label','middle')}${line(205,85,270,120)}${line(415,85,350,120)}${line(205,225,270,170)}${line(415,225,350,170)}${txt(310,285,'classify → model → calculate → explain','分类 → 建模 → 计算 → 解释','svg-small','middle')}`);
      case 16:return svg(`${line(55,150,240,150,'svg-accent')}${rect(245,55,18,190,'svg-node2',2)}${txt(254,270,'gold foil','金箔','svg-small','middle')}${circle(405,150,24,'svg-node3')}${txt(405,155,'+','+','svg-equation','middle')}${line(263,150,555,150,'svg-accent')}${line(263,145,520,70,'svg-warn')}${line(263,155,490,230,'svg-line')}${txt(485,55,'rare large deflection','少数大角度偏转','svg-small','middle')}${txt(455,140,'most pass through','大多数直穿','svg-small','middle')}${txt(405,195,'tiny + nucleus','很小的正原子核','svg-small','middle')}`);
      default:return svg(`${txt(310,150,'Physics model','物理模型','svg-label','middle')}`);
    }
  }

  function currentLessonNumber(){
    const count=$('#lessonPanel .lesson-count')?.textContent||'';
    const match=count.match(/\d+/);
    if(match)return Number(match[0]);
    const active=$('#courseList [data-seq-lesson].active');
    if(active)return Number(active.dataset.seqLesson)+1;
    return 1;
  }

  function lessonData(n){
    const api=window.PARTICLELAB_LESSON_SEQUENCE;
    if(!api)return null;
    return api.getLocalizedLesson?.(n)||api.lessons?.find(x=>x.n===n)||null;
  }

  function specPoints(n){
    if(zh())return window.PARTICLELAB_MANDARIN_LESSONS?.lessons?.[n]?.spec||[];
    return window.PARTICLELAB_LESSON_SEQUENCE?.specCoverage?.[n]?.points||[];
  }

  function photoHTML(n){
    const p=photos[n];if(!p)return '';
    return `<figure class="textbook-figure textbook-photo-figure"><div class="textbook-photo"><img loading="lazy" referrerpolicy="no-referrer" src="${p.src}" alt="${esc(tr(p.en,p.zh))}" onerror="this.parentElement.classList.add('is-failed')"><div class="photo-fallback">${esc(tr('Image unavailable — the textbook diagram and lesson content still work offline.','图片暂时无法加载——教材图示和课程内容仍可离线使用。'))}</div></div><figcaption><strong>${esc(tr('Real / sourced visual','真实 / 来源图像'))}.</strong> ${esc(tr(p.en,p.zh))}<br><span class="textbook-credit">${esc(p.credit)} · ${esc(p.license)} · <a href="${p.page}" target="_blank" rel="noopener noreferrer">${esc(tr('source & licence','来源与许可'))}</a></span></figcaption></figure>`;
  }

  function equationsHTML(lesson){
    const eq=(lesson?.equations||[]).filter(Boolean);
    return `<section class="textbook-study-card equations"><span class="eyebrow">${esc(tr('Key equations / relationships','关键方程 / 关系'))}</span><h4>${esc(tr(eq.length?'Use these deliberately':'Conceptual lesson','有目的地使用这些方程':'概念课'))}</h4>${eq.length?`<div class="textbook-equation-list">${eq.map(x=>`<div class="textbook-equation">${esc(x)}</div>`).join('')}</div>`:`<p>${esc(tr('There is no new calculation equation to memorise here. Focus on the physical model, definitions and cause-and-effect reasoning.','本课没有新的计算公式需要记忆；重点是物理模型、定义以及因果推理。'))}</p>`}</section>`;
  }

  function enhance(){
    const host=$('.lesson-active-section .lesson-textbook')||$('.lesson-full-plan .lesson-textbook');
    if(!host)return;
    const n=currentLessonNumber();
    if(host.dataset.fullTextbookLesson===String(n))return;
    const lesson=lessonData(n);if(!lesson)return;
    host.querySelector('.textbook-full-chapter')?.remove();
    const points=specPoints(n);
    const mis=misconceptions[n]||misconceptions[1];
    const visualTitle=diagramTitle[n]||['Physics diagram','物理图示'];
    const sectionCount=window.PARTICLELAB_LESSON_SEQUENCE?.textbook?.[n]?.sections?.length||0;
    const front=document.createElement('section');
    front.className='textbook-full-chapter';
    front.innerHTML=`
      <div class="textbook-chapter-hero">
        <div>
          <span class="eyebrow">${esc(tr('Full digital textbook chapter','完整数字教材章节'))}</span>
          <h3>${esc(lesson.title||'')}</h3>
          <p>${esc(lesson.overview||'')}</p>
          <div class="textbook-chapter-badges"><span>${esc(lesson.code||'')}</span><span>${sectionCount} ${esc(tr('guided reading sections','个引导阅读章节'))}</span><span>${esc(tr('diagram + worked example + exam focus','图示 + 示例 + 考试重点'))}</span></div>
        </div>
        <aside>
          <div><strong>${esc(tr('How to read this chapter','如何学习本章节'))}</strong><span>${esc(tr('Read the visual overview first, then work through each guided section below. Attempt every checkpoint before revealing the model response.','先看视觉概览，再按顺序学习下方各引导章节。每个检查题都应先独立作答，再查看参考答案。'))}</span></div>
          <div><strong>${esc(tr('AQA focus','AQA 重点'))}</strong><span>${esc(tr('Every required point is connected to the specification checklist shown in this lesson.','本课所有必学内容都与本课的 AQA 规格要求清单相连接。'))}</span></div>
        </aside>
      </div>
      <div class="textbook-reading-route"><b>${esc(tr('Reading route:','阅读路线：'))}</b><span>${esc(tr('1 Visual overview','1 视觉概览'))}</span><span>${esc(tr('2 Guided reading','2 引导阅读'))}</span><span>${esc(tr('3 Checkpoints','3 检查题'))}</span><span>${esc(tr('4 Worked example','4 示例'))}</span><span>${esc(tr('5 Exam wording','5 考试表述'))}</span></div>
      <div class="textbook-visual-grid">
        <figure class="textbook-figure"><div class="textbook-figure-graphic">${diagram(n)}</div><figcaption><strong>${esc(tr('Figure','图'))} ${n}.</strong> ${esc(tr(...visualTitle))}. ${esc(tr('Original teaching diagram created for this app; not to physical scale unless stated.','本应用原创教学图示；除非另有说明，否则不按真实比例绘制。'))}</figcaption></figure>
        ${photoHTML(n)||`<section class="textbook-figure"><div class="textbook-figure-graphic">${diagram(n)}</div><figcaption><strong>${esc(tr('Second visual pass','第二次视觉复习'))}.</strong> ${esc(tr('Use the diagram to explain the physics aloud without reading the paragraph text.','不看正文，仅根据图示大声解释物理过程。'))}</figcaption></section>`}
      </div>
      <div class="textbook-study-grid">
        ${equationsHTML(lesson)}
        <section class="textbook-study-card worked-example"><span class="eyebrow">${esc(tr('Worked example / model reasoning','示例 / 模型推理'))}</span><h4>${esc(tr('Follow the physics, not just the answer','关注物理过程，而不仅是答案'))}</h4><p>${esc(lesson.worked||tr('Use the lesson example and explain each step.','使用本课示例，并解释每一步。'))}</p></section>
        <section class="textbook-study-card misconception"><span class="eyebrow">${esc(tr('Common misconception','常见误区'))}</span><h4>${esc(tr('Do not write this incorrectly','避免这样错误理解'))}</h4><p>${esc(tr(...mis))}</p></section>
        <section class="textbook-study-card exam-focus"><span class="eyebrow">${esc(tr('AQA exam focus','AQA 考试重点'))}</span><h4>${esc(tr('Precise wording matters','精确表述很重要'))}</h4><p>${esc(lesson.exam||'')}</p></section>
      </div>
      <section class="textbook-chapter-summary"><span class="eyebrow">${esc(tr('Chapter summary — what you must know','章节总结——必须掌握'))}</span><h4>${esc(tr('Specification-linked checklist','规格要求关联清单'))}</h4><ul>${(points.length?points:(lesson.objectives||[])).map(p=>`<li>${esc(p)}</li>`).join('')}</ul></section>`;
    const intro=host.querySelector('.textbook-intro');
    intro?.insertAdjacentElement('afterend',front);
    if(!intro)host.prepend(front);
    host.dataset.fullTextbookLesson=String(n);
  }

  let queued=false;
  function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})}
  const observer=new MutationObserver(schedule);
  function init(){
    const panel=$('#lessonPanel');if(!panel){setTimeout(init,120);return}
    observer.observe(panel,{subtree:true,childList:true});
    document.addEventListener('click',e=>{if(e.target.closest('[data-seq-stage],[data-seq-lesson],[data-lesson-view]'))setTimeout(schedule,20)});
    window.addEventListener('particlelab:languagechange',()=>setTimeout(()=>{const h=$('.lesson-textbook');if(h)delete h.dataset.fullTextbookLesson;schedule()},30));
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
