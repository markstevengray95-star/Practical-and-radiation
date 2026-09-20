
(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleLessonSequenceV1';

  const lessons=[
    {
      n:1,phase:'Foundations',code:'3.2.1.1',title:'Atomic structure, nuclide notation & isotopes',duration:'50–60 min',
      overview:'Build the language students need for the whole topic: proton, neutron, electron, Z, A, nuclide notation, isotopes, relative/SI particle data and simple isotopic information.',
      objectives:['State proton, neutron and electron charge and mass data in relative and SI form.','Use Z and A correctly in nuclide notation.','Calculate neutron number, identify isotopes and interpret simple isotopic data.'],
      recall:['What particles are found in an atom?','What does atomic number tell you at GCSE?','What does “neutral atom” mean?'],
      teach:[
        ['1. Build the atom','Nucleus = protons + neutrons; electrons occupy the region around it. Emphasise that the 3D model is not to scale.'],
        ['2. Particle data','Proton: +e, about 1 u, 1.673 × 10⁻²⁷ kg. Neutron: 0, about 1 u, 1.675 × 10⁻²⁷ kg. Electron: −e, about 1/1836 u, 9.109 × 10⁻³¹ kg. Use e = 1.602 × 10⁻¹⁹ C.'],
        ['3. Introduce Z and A','Z = proton number. A = nucleon number = protons + neutrons. Neutrons = A − Z.'],
        ['4. Nuclide notation','Practise reading ᴬZX and moving between notation and particle numbers.'],
        ['5. Isotopes and isotopic data','Isotopes have the same Z but different neutron number. Read simple isotopic data to identify the isotope and determine proton, neutron and electron counts.']
      ],
      sim:'atom',simTask:'Use the particle palette on the 3D screen: drag p⁺ and n⁰ into the nucleus and e⁻ into the electron region. Build H-1, C-12, then make C-14 by adding two neutrons without changing Z, before building neutral sodium-23. Say p, n and e before pressing Check my atom.',
      equations:['N = A − Z'],worked:'For ²³₁₁Na: p = 11, n = 12 and a neutral atom has 11 electrons.',
      exam:'“Isotopes are atoms of the same element with the same proton number but different neutron numbers.”',
      exit:['State the charge and approximate relative mass of proton, neutron and electron.','How many neutrons are in ³⁷₁₇Cl?','Why does changing neutron number not change the element?'],
      next:'Specific charge',homework:'Short isotope / nuclide-notation retrieval practice.'
    },
    {
      n:2,phase:'Foundations',code:'3.2.1.1',title:'Specific charge of particles, nuclei & ions',duration:'50–60 min',
      overview:'Turn atomic structure into a quantitative skill by calculating charge per unit mass for particles, nuclei and ions.',
      objectives:['Define specific charge.','Calculate total charge for nuclei and ions.','Use total mass and charge to calculate Q/m with correct units.'],
      recall:['State proton and electron charge.','Which particle has much smaller mass: proton or electron?','What happens to charge when an electron is removed?'],
      teach:[
        ['1. Define specific charge','Specific charge = charge per unit mass, not “charge of one proton”.'],
        ['2. Build total charge','For a nucleus Q = Ze. For ions, use proton number minus electron number.'],
        ['3. Build total mass','Mass is dominated by nucleons; electrons contribute very little.'],
        ['4. Compare e⁻ and p','Same |Q| but electron mass is far smaller, so |Q/m| is much larger.']
      ],
      sim:'specific',simTask:'Create a neutral atom, a +1 ion and a −1 ion. Predict the sign of Q/m before reading the result.',
      equations:['specific charge = Q / m','Q = (Z − Nₑ)e'],worked:'For a +2 ion, find total charge first: Q = +2e = +3.204 × 10⁻¹⁹ C, then divide by the ion mass.',
      exam:'Always state the unit C kg⁻¹ and use the charge/mass of the whole particle being considered.',
      exit:['What is the unit of specific charge?','Why is electron |Q/m| so large?','What sign does Q/m have for an anion?'],
      next:'Strong nuclear force',homework:'Three specific-charge calculations of increasing difficulty.'
    },
    {
      n:3,phase:'Foundations',code:'3.2.1.2',title:'Nuclear stability & the strong nuclear force',duration:'50–60 min',
      overview:'Explain why nuclei can exist despite proton–proton electrostatic repulsion.',
      objectives:['Describe the strong nuclear force as separation changes.','Identify attractive, repulsive and negligible regions.','Explain its role in nuclear stability.'],
      recall:['What force acts between two positive charges?','What length scale is 1 fm?','What particles are nucleons?'],
      teach:[
        ['1. The stability problem','Protons repel electrically, so another interaction is required to bind nuclei.'],
        ['2. Attractive region','Strong nuclear force is attractive over typical nuclear separations up to about 3 fm.'],
        ['3. Very-short-range repulsion','Closer than about 0.5 fm it becomes strongly repulsive.'],
        ['4. Short range','Beyond a few femtometres it becomes negligible.']
      ],
      sim:'strong',simTask:'Move through the repulsive, attractive and negligible regions. Record the separation range for each.',
      equations:[],worked:'At about 1 fm the strong nuclear force is attractive and can overcome proton electrostatic repulsion over this short range.',
      exam:'Use all three words in extended answers: “repulsive very close, attractive at nuclear separations, negligible beyond a few fm.”',
      exit:['At 0.3 fm, is the force attractive or repulsive?','At 1 fm?','Why does the force not bind separate atoms together?'],
      next:'Radioactive decay',homework:'Sketch and annotate force vs separation qualitatively.'
    },
    {
      n:4,phase:'Foundations',code:'3.2.1.2',title:'Alpha decay, beta-minus decay & the neutrino',duration:'50–60 min',
      overview:'Complete the AQA 3.2.1.2 core by learning how unstable nuclei change in alpha and beta-minus decay, and why the neutrino was proposed.',
      objectives:['Balance alpha and beta-minus nuclear equations.','State how A and Z change in α and β⁻ decay.','Explain why the neutrino was proposed from beta-decay evidence.'],
      recall:['What do A and Z represent?','What is an alpha particle?','Which quantities must remain conserved in a decay?'],
      teach:[
        ['1. Alpha decay','An alpha particle is a helium-4 nucleus, ⁴₂He. Emitting one makes A decrease by 4 and Z decrease by 2.'],
        ['2. Beta-minus decay','A neutron changes to proton character and an electron plus electron antineutrino are emitted. A is unchanged and Z increases by 1.'],
        ['3. Why the neutrino?','The neutrino was proposed because beta-decay observations required an unseen particle to account for the missing energy.'],
        ['4. Keep the specification sequence clear','β⁺, electron capture and electron–proton collisions are taught later under AQA 3.2.1.4 particle interactions, where W⁺ and W⁻ exchange is introduced.']
      ],
      sim:'decay',simTask:'Run α and β⁻ first. Before each animation, predict the change in A and Z and identify every emitted particle. Use β⁺ later when you reach the particle-interactions lesson.',
      equations:['α: ᴬZX → ᴬ⁻⁴Z⁻²Y + ⁴₂He','β⁻: n → p + e⁻ + ν̄ₑ'],worked:'In β⁻ decay the mass number A stays the same while Z increases by 1 because neutron character changes to proton character.',
      exam:'For AQA 3.2.1.2, be precise: α changes A and Z; β⁻ leaves A unchanged, increases Z by 1 and emits an electron antineutrino. The beta electron is created in the decay.',
      exit:['What happens to A and Z in alpha decay?','What happens to A and Z in β⁻ decay?','Why was the neutrino proposed?'],
      next:'Antiparticles & photons',homework:'Balance alpha and beta-minus decay equations, then explain the neutrino evidence in one sentence.'
    },
    {
      n:5,phase:'Particle physics',code:'3.2.1.3',title:'Photons, rest energy & antiparticles',duration:'50–60 min',
      overview:'Introduce the photon model and the idea that every particle has a corresponding antiparticle.',
      objectives:['Use E = hf and E = hc/λ for photons.','Compare particle and antiparticle properties.','Interpret particle rest energies quoted in MeV without treating E = mc² as a required AQA calculation here.'],
      recall:['What is frequency?','What is wavelength?','What does c represent?'],
      teach:[
        ['1. Photon model','EM radiation is exchanged in quanta called photons, with energy hf.'],
        ['2. Rest energy','Mass has rest energy E₀ = mc²; particle rest energies are often quoted in MeV.'],
        ['3. Antiparticle pairs','Same mass/rest energy; opposite relevant additive quantum numbers.'],
        ['4. Key examples','e⁻/e⁺, p/p̄, n/n̄ and ν/ν̄. Neutral does not mean “same particle”.']
      ],
      sim:'antimatter',simTask:'Use comparison mode to inspect electron/positron, proton/antiproton and neutron/antineutron pairs.',
      equations:['E = hf','E = hc / λ'],worked:'Electron rest energy is 0.511 MeV, so an electron + positron pair has 1.022 MeV of rest energy in total.',
      exam:'Know that a particle and antiparticle have equal mass and opposite charge when charged, and recognise their rest energies in MeV. Do not reduce the definition to “opposite charge” because neutral particles can have distinct antiparticles.',
      exit:['What stays the same for a particle and antiparticle?','What is a photon’s energy equation?','Why is an antineutron distinct from a neutron?'],
      next:'Annihilation & pair production',homework:'Photon-energy calculations in J and eV.'
    },
    {
      n:6,phase:'Particle physics',code:'3.2.1.3',title:'Annihilation & pair production',duration:'50–60 min',
      overview:'Apply rest energy, photon energy and momentum conservation to matter–antimatter processes.',
      objectives:['Describe annihilation and pair production.','Calculate the minimum energy for e⁻/e⁺ pair creation.','Explain why momentum conservation matters.'],
      recall:['What is the rest energy of one electron?','State E = hf.','What quantities are conserved in interactions?'],
      teach:[
        ['1. Annihilation','Particle + antiparticle energy becomes other particles; use e⁻/e⁺ → γ + γ as the key example.'],
        ['2. Minimum energy','Slow e⁻ + e⁺ provide 1.022 MeV total rest energy.'],
        ['3. Pair production','A sufficiently energetic photon can create e⁻ + e⁺ near another body.'],
        ['4. Momentum','The nearby nucleus/body can recoil, making momentum conservation possible.']
      ],
      sim:'antimatter',simTask:'Run annihilation, then pair production. Explain the energy flow and why momentum must be considered.',
      equations:['minimum e⁻/e⁺ rest energy = 2 × 0.511 MeV = 1.022 MeV'],worked:'If a photon has 1.50 MeV, 1.022 MeV can become rest energy and the remainder can appear as kinetic/recoil energy.',
      exam:'For slow e⁻/e⁺ annihilation, two photons are commonly shown moving oppositely so momentum can be conserved.',
      exit:['What is the pair-production threshold for e⁻/e⁺?','Why is a nearby nucleus useful?','Where can energy above threshold go?'],
      next:'Fundamental interactions',homework:'One annihilation and one pair-production calculation.'
    },
    {
      n:7,phase:'Particle physics',code:'3.2.1.4',title:'Fundamental interactions & exchange particles',duration:'50–60 min',
      overview:'Move from “forces” to the exchange-particle model used in particle physics.',
      objectives:['Name the four fundamental interactions.','Identify the AQA exchange particles for EM and weak interactions.','Read simple particle-interaction diagrams.'],
      recall:['Which forces are familiar from GCSE?','What is transferred in a collision?','What did beta decay do to neutron/proton character?'],
      teach:[
        ['1. Four interactions','Gravity, electromagnetic, weak and strong.'],
        ['2. Exchange idea','Interactions can be represented by exchange particles carrying energy/momentum.'],
        ['3. Electromagnetic','Virtual photon is the AQA exchange particle.'],
        ['4. Weak interaction','W⁺ and W⁻ appear in β⁻, β⁺, electron capture and electron–proton processes.']
      ],
      sim:'interactions',simTask:'Switch through EM and each weak process. Identify incoming, exchange and outgoing particles.',
      equations:[],worked:'At quark level in β⁻: d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ.',
      exam:'AQA does not test gluon, Z⁰ or graviton knowledge in this section.',
      exit:['Exchange particle for EM?','Which W appears in β⁻?','What three parts should you identify in an interaction diagram?'],
      next:'Classifying particles',homework:'Label four simple exchange-particle diagrams.'
    },
    {
      n:8,phase:'Particle physics',code:'3.2.1.5',title:'Classifying particles: hadrons, leptons & strange particles',duration:'50–60 min',
      overview:'Build the family tree before introducing quark structure.',
      objectives:['Classify particles as hadrons or leptons.','Split hadrons into baryons and mesons.','Describe strange-particle production and decay.'],
      recall:['Do protons feel the strong interaction?','Name an electron-family lepton.','What is an antiparticle?'],
      teach:[
        ['1. Hadrons vs leptons','Hadrons experience the strong interaction; leptons do not.'],
        ['2. Baryons','Proton, neutron and antibaryons. Proton is the stable baryon in the AQA classification statement.'],
        ['3. Mesons','Pions and kaons. Pions also appear in the nucleon strong-force exchange model.'],
        ['4. Lepton families and lepton number','Electron/electron-neutrino form one lepton family and muon/muon-neutrino another. Particles have family lepton number +1 and antiparticles −1; track electron and muon lepton numbers separately.'],
        ['5. Strange particles','Produced through strong interaction, typically in pairs so total strangeness is conserved; they decay through the weak interaction.'],
        ['6. Pions, muons & scientific evidence','Pion is the AQA exchange particle for the strong nuclear force between nucleons. Muons decay to products including an electron. Modern particle physics depends on large collaborations reproducing and validating results.']
      ],
      sim:'classification',simTask:'Sort each displayed particle into the full family: e.g. proton = hadron + baryon.',
      equations:[],worked:'K⁺ is a hadron and meson. It is strange because its quark content includes s̄ and it has non-zero strangeness. In strong production, total strangeness is conserved, so strange particles are created with balancing strangeness.',
      exam:'Give the full classification when asked, not just one family label.',
      exit:['Is a pion a baryon or meson, and what role does AQA assign it in the nucleon strong-force model?','What happens when a muon decays?','How are strange particles produced and how do they decay?'],
      next:'Quarks & antiquarks',homework:'Complete a particle-family classification table.'
    },
    {
      n:9,phase:'Particle physics',code:'3.2.1.6',title:'Quarks, antiquarks & hadron structure',duration:'50–60 min',
      overview:'Use u, d and s quarks to explain the particles students classified last lesson.',
      objectives:['Recall u, d and s quantum numbers.','Build proton, neutron, pions and kaons.','Calculate total charge, baryon number and strangeness.'],
      recall:['What is a baryon?','What is a meson?','What is strangeness?'],
      teach:[
        ['1. Quark properties','u: +2/3e; d and s: −1/3e. All quarks B = +1/3.'],
        ['2. Antiquarks','Reverse additive quantum numbers: charge, B and strangeness.'],
        ['3. Baryons','Proton = uud; neutron = udd. Antibaryons contain three antiquarks.'],
        ['4. Mesons','One quark + one antiquark; practise pions and kaons.'],
        ['5. Neutron decay at quark level','A neutron udd becomes a proton uud when one down quark changes to an up quark: d → u. The full weak-interaction detail and W⁻ diagram are then connected back to the interactions lesson.']
      ],
      sim:'quarks',simTask:'Build p, n, π⁺, π⁻, K⁺ and K⁻. Predict Q, B and S before reading the totals.',
      equations:['p = uud','n = udd','quark B = +1/3','antiquark B = −1/3'],worked:'π⁺ = u d̄: charge = +2/3e + +1/3e = +e; B = +1/3 − 1/3 = 0.',
      exam:'Write the constituent values first, then add Q, B and S. This reduces sign errors.',
      exit:['State proton and neutron quark content, then give the quark change in neutron β⁻ decay.','What is B for a meson?','What is S for an anti-strange quark?'],
      next:'Conservation laws & reactions',homework:'Quark-content and quantum-number calculations.'
    },
    {
      n:10,phase:'Particle physics',code:'3.2.1.7',title:'Conservation laws & particle reactions',duration:'50–60 min',
      overview:'Bring classification, quarks and weak interactions together to decide whether particle reactions are allowed.',
      objectives:['Apply conservation of charge, baryon number and lepton number.','Apply strangeness rules to strong and weak interactions.','Recognise quark-character changes in beta decay.'],
      recall:['What is B for a quark?','What is electron lepton number for e⁻ and νₑ?','When is strangeness conserved?'],
      teach:[
        ['1. Conservation method','Create left and right totals for one quantum number at a time.'],
        ['2. Charge and B','Always conserved in the interactions studied.'],
        ['3. Lepton families','Track electron and muon lepton numbers separately.'],
        ['4. Strangeness','Conserved in strong interactions; may change by 0 or ±1 in weak interactions.'],
        ['5. Beta at quark level','β⁻: d → u; β⁺: u → d.']
      ],
      view:'conserve',viewLabel:'Open conservation-law checker',simTask:'Test each built-in reaction one quantum number at a time. Explain why allowed/forbidden examples differ.',
      equations:['ΣQ before = ΣQ after','ΣB before = ΣB after','ΣL before = ΣL after'],worked:'n → p + e⁻ + ν̄ₑ: charge 0 = +1 −1 +0; B 1 = 1; electron L 0 = +1 −1.',
      exam:'Do not judge a reaction by charge alone. A reaction can conserve charge but fail baryon or lepton number.',
      exit:['Which quantities must you check?','When is strangeness conserved?','What quark change occurs in β⁻ decay?'],
      next:'Photoelectric effect',homework:'Allowed/not-allowed reaction questions with full working.'
    },
    {
      n:11,phase:'Quantum phenomena',code:'3.2.2.1',title:'Photoelectric effect',duration:'50–60 min',
      overview:'Use experimental observations to build the photon model of electromagnetic radiation.',
      objectives:['Explain threshold frequency using photons.','Use hf = φ + KEmax and KEmax = eVs.','Distinguish effects of frequency and intensity.'],
      recall:['State E = hf.','What is a photon?','What does kinetic energy mean?'],
      teach:[
        ['1. Observations','Below threshold frequency: no emission. Above it: immediate emission.'],
        ['2. One photon–one electron','Each electron absorbs one photon of energy hf.'],
        ['3. Work function','Minimum energy needed to remove an electron from the metal.'],
        ['4. Frequency vs intensity','Frequency changes photon energy; intensity mainly changes photon rate.'],
        ['5. Stopping potential','eVs = KEmax for the fastest photoelectrons.']
      ],
      sim:'photo',simTask:'Find threshold frequency for two work functions. Then hold frequency fixed and vary intensity.',
      equations:['E = hf','hf = φ + KEmax','KEmax = eVs','f₀ = φ / h'],worked:'Photon energy 4.0 eV, φ = 2.3 eV → KEmax = 1.7 eV and Vs = 1.7 V.',
      exam:'Never say “greater intensity gives more energetic photons” when frequency is unchanged.',
      exit:['What determines photon energy?','What happens below threshold frequency?','How is stopping potential linked to KEmax?'],
      next:'Electron collisions & eV',homework:'Photoelectric calculations and one explanation question.'
    },
    {
      n:12,phase:'Quantum phenomena',code:'3.2.2.2',title:'Electron collisions, excitation, ionisation & the electron volt',duration:'50–60 min',
      overview:'Connect energy transfer in collisions to quantised atomic energies.',
      objectives:['Distinguish excitation from ionisation.','Explain threshold behaviour in electron collisions.','Convert between eV and J.'],
      recall:['What is an energy level?','What is ionisation at GCSE?','State elementary charge e.'],
      teach:[
        ['1. Excitation','Electron remains bound but moves to a higher allowed energy.'],
        ['2. Quantised transfer','For excitation, energy transfer must match an allowed level difference.'],
        ['3. Ionisation','Enough energy removes an electron completely.'],
        ['4. Electron volt','1 eV = 1.602 × 10⁻¹⁹ J. Practise both directions.'],
        ['5. Fluorescent tube','Collision → excitation/ionisation → de-excitation → photon emission.']
      ],
      sim:'collisions',simTask:'Find the no-change, excitation and ionisation regions. Explain what happens to leftover incident-electron KE.',
      equations:['1 eV = 1.602 × 10⁻¹⁹ J'],worked:'10 eV = 10 × 1.602 × 10⁻¹⁹ J = 1.602 × 10⁻¹⁸ J.',
      exam:'Excitation leaves the atomic electron bound. Ionisation removes it completely.',
      exit:['Define excitation.','Define ionisation.','Convert 5 eV to joules.'],
      next:'Energy levels & line spectra',homework:'eV/J conversions plus excitation/ionisation explanations.'
    },
    {
      n:13,phase:'Quantum phenomena',code:'3.2.2.3',title:'Energy levels, photons & line spectra',duration:'50–60 min',
      overview:'Explain why atomic spectra contain discrete lines rather than a continuous range.',
      objectives:['Interpret energy-level diagrams.','Calculate photon energy/frequency/wavelength from ΔE.','Explain why line spectra support discrete energy levels.'],
      recall:['What does excitation mean?','State E = hf.','What happens when an electron loses energy?'],
      teach:[
        ['1. Discrete levels','Only particular bound energies are allowed.'],
        ['2. Downward transitions','Energy lost becomes one photon with ΔE = hf.'],
        ['3. Upward transitions','Absorption requires the correct photon energy.'],
        ['4. Line spectra','Only certain ΔE values exist, so only certain photon wavelengths are emitted.'],
        ['5. Units','Levels may be given in J or eV; convert when necessary.']
      ],
      sim:'levels',simTask:'Compare several downward transitions. Rank them by photon energy and wavelength before checking.',
      equations:['ΔE = hf','ΔE = hc / λ'],worked:'Larger ΔE means higher photon frequency and shorter wavelength.',
      exam:'The horizontal lines are allowed energies, not physical electron orbits.',
      exit:['Why are spectra lines discrete?','What happens in a downward transition?','Which transition gives the shortest wavelength?'],
      next:'Wave–particle duality',homework:'Energy-level diagram and spectral-line questions.'
    },
    {
      n:14,phase:'Quantum phenomena',code:'3.2.2.4',title:'Wave–particle duality & electron diffraction',duration:'50–60 min',
      overview:'Finish the core topic by combining particle evidence for light with wave evidence for matter.',
      objectives:['Explain what electron diffraction demonstrates.','Use λ = h/p.','Predict how diffraction changes as momentum changes.'],
      recall:['What did the photoelectric effect show about light?','What phenomenon is usually associated with waves?','State momentum p for non-relativistic motion.'],
      teach:[
        ['1. Evidence for matter waves','Electron diffraction is wave-like behaviour from particles.'],
        ['2. de Broglie relation','λ = h/p applies wavelength to moving particles.'],
        ['3. Momentum trend','Higher p → shorter λ.'],
        ['4. Diffraction trend','For the same structure, shorter λ generally means less diffraction / tighter pattern.'],
        ['5. Duality','Quantum objects are not simply classical waves or classical particles.'],
        ['6. How knowledge changes','New models are evaluated through evidence, peer review, replication and validation by the scientific community.']
      ],
      sim:'diffraction',simTask:'Increase accelerating voltage and explain the chain V ↑ → p ↑ → λ ↓ → pattern changes.',
      equations:['λ = h / p','p = mv'],worked:'If momentum doubles, de Broglie wavelength halves.',
      exam:'Electron diffraction gives wave evidence for matter; photoelectric effect gives particle evidence for EM radiation. Details of a particular electron-diffraction method are not required by AQA, but the evidence and momentum trend are.',
      exit:['What does λ = h/p predict?','What happens to λ as p rises?','Give one experiment supporting each side of wave–particle duality.'],
      next:'Synoptic review',homework:'Mixed wave–particle duality questions.'
    },
    {
      n:15,phase:'Consolidation',code:'3.2 mixed',title:'Synoptic Particles & Radiation review',duration:'50–60 min',
      overview:'Bring the whole core topic together before moving on.',
      objectives:['Connect particle physics and quantum phenomena.','Identify weak areas using the mastery map.','Answer mixed short and extended questions under timed conditions.'],
      recall:['List the 11 AQA 3.2 subsection headings from memory or reconstruct them.','Write every core equation you can remember.','Name three common misconceptions you now know to avoid.'],
      teach:[
        ['1. Retrieval grid','Atoms → nuclei → antiparticles → interactions → classification → quarks → conservation.'],
        ['2. Quantum chain','Photoelectric effect → electron collisions → energy levels → diffraction.'],
        ['3. Mixed maths','Specific charge, photons, eV/J, energy levels and de Broglie wavelength.'],
        ['4. Exam technique','Use definitions precisely and always link observations to physics principles.']
      ],
      view:'quiz',viewLabel:'Open mixed practice quiz',simTask:'Complete a mixed quiz, then open the Mastery Map and revisit one red/amber area.',
      equations:['Q/m','E = hf','hf = φ + KEmax','ΔE = hf','λ = h/p','1 eV = 1.602 × 10⁻¹⁹ J'],
      worked:'For any unfamiliar reaction: classify particles, list quantum numbers, then test conservation one quantity at a time.',
      exam:'Use the simulation explanations to revise, but practise expressing the physics without relying on the visual.',
      exit:['Which three subtopics are strongest?','Which one still needs revision?','Can you explain one simulation in exam language without looking?'],
      next:'Optional Rutherford extension',homework:'Targeted revision from the mastery map.'
    },
    {
      n:16,phase:'A-level extension',code:'3.8.1.1',title:'Rutherford scattering & development of the nuclear model',duration:'50–60 min',extension:true,
      overview:'Optional extension beyond core 3.2: use alpha scattering evidence to explain why the nuclear model replaced diffuse-positive-charge models.',
      objectives:['State the qualitative Rutherford observations.','Link each observation to an inference about atomic structure.','Explain how impact parameter affects deflection qualitatively.'],
      recall:['What is an alpha particle?','What electric charges do alpha particle and nucleus have?','What does “mostly empty space” mean in atomic structure?'],
      teach:[
        ['1. Old-model prediction','A diffuse positive charge would mainly cause small deflections.'],
        ['2. Key observations','Most straight; some deflected; very few scattered through large angles/backwards.'],
        ['3. Evidence → model','Mostly empty space; positive charge and most mass concentrated in tiny nucleus.'],
        ['4. Impact parameter','Smaller b → closer approach → stronger electrostatic repulsion → larger angle.'],
        ['5. Scientific models','Evidence can force a model to be replaced or refined.']
      ],
      sim:'rutherford',simTask:'Use both Rutherford models. Change impact parameter and explain every trajectory using Coulomb repulsion.',
      equations:['smaller b → larger scattering angle','electrostatic force increases strongly at small separation'],worked:'“Very few alpha particles scatter backwards” means only a tiny fraction come close to a very small, highly concentrated positive nucleus.',
      exam:'Write observation first, inference second. Do not merge them into one vague statement.',
      exit:['Why do most alpha particles pass straight through?','Why are large-angle events rare?','What does a smaller impact parameter do?'],
      next:'Nuclear Physics',homework:'Optional Rutherford exam-style explanation.',
    }
  ];

  

  const lessonTaskBank={
    1:[
      ['Particle ID','State the charge of a proton, neutron and electron.','p = +e, n = 0, e⁻ = −e.'],
      ['Particle mass scale','Compare the approximate relative masses of proton, neutron and electron.','Proton ≈ 1 u, neutron ≈ 1 u, electron ≈ 1/1836 u. In SI, electron mass is about 9.11 × 10⁻³¹ kg while nucleons are about 1.67 × 10⁻²⁷ kg.'],
      ['Read nuclide notation','For ²³₁₁Na, state Z and A.','Z = 11 and A = 23.'],
      ['Find neutrons','How many neutrons are in ²³₁₁Na?','A − Z = 23 − 11 = 12 neutrons.'],
      ['Neutral atom','How many electrons are in neutral ²³₁₁Na?','11 electrons because a neutral atom has electrons = protons.'],
      ['Isotope reasoning','What changes between ¹²₆C and ¹⁴₆C?','Neutron number changes from 6 to 8; proton number stays 6.'],
      ['Ion reasoning','What changes when ²³Na becomes Na⁺?','Only electron number changes: 11 → 10. The nucleus is unchanged.']
    ],
    2:[
      ['Sign first','Predict the sign of Q/m for a +2 ion.','Positive, because Q is positive.'],
      ['Whole particle','Why must total ion mass be used in Q/m?','Specific charge is charge per unit mass of the whole particle.'],
      ['Compare','Why is |Q/m| far greater for an electron than a proton?','Same |Q| but electron mass is much smaller.']
    ],
    3:[
      ['Three regions','Describe the strong force at 0.3 fm, 1 fm and 4 fm.','Repulsive; attractive; negligible.'],
      ['Nuclear stability','Why does the nucleus not simply fly apart from proton repulsion?','At nuclear distances the attractive strong force can overcome electrostatic repulsion.'],
      ['Explain range','Why does the strong force not bind separate atoms?','It is very short range and negligible beyond a few fm.']
    ],
    4:[
      ['Balance α','A parent has A = 226 and Z = 88. Find daughter A and Z after α decay.','A = 222, Z = 86.'],
      ['Balance β⁻','What happens to A and Z in β⁻ decay?','A unchanged, Z +1.'],
      ['Neutrino','Why is a neutrino/antineutrino included in beta decay?','To satisfy conservation laws including energy, momentum and lepton number.']
    ],
    5:[
      ['Same / opposite','Give two properties shared by particle and antiparticle.','Same mass and same rest energy.'],
      ['Photon maths','What happens to photon energy if frequency doubles?','Photon energy doubles because E = hf.'],
      ['Neutral antiparticle','Why can a neutral particle still have a distinct antiparticle?','Antiparticle identity also depends on additive quantum numbers, not charge alone.']
    ],
    6:[
      ['Threshold','Minimum rest energy for e⁻e⁺ pair creation?','1.022 MeV.'],
      ['Extra energy','A photon has energy above threshold. Where can the extra energy go?','Into kinetic energy and recoil while conserving momentum.'],
      ['Two photons','Why are two photons commonly shown in slow e⁻e⁺ annihilation?','Opposite photon momenta can conserve total momentum.']
    ],
    7:[
      ['EM exchange','Name the AQA exchange particle for EM interactions.','Virtual photon.'],
      ['Weak exchange','Which W boson appears in β⁻ decay?','W⁻.'],
      ['Read a diagram','What three things should you identify first?','Incoming particles, exchange particle and outgoing particles.']
    ],
    8:[
      ['Full class','Classify a proton fully.','Hadron → baryon.'],
      ['Meson','Classify a pion fully.','Hadron → meson.'],
      ['Lepton families','State electron and muon lepton numbers for e⁻, νₑ, μ⁻ and νμ, and explain what happens for antiparticles.','Each listed particle has +1 in its own lepton family and 0 in the other; the corresponding antiparticle has −1 in its own family.'],
      ['Strange particles','How are strange particles typically produced and how do they decay?','Produced via strong interaction; decay via weak interaction.']
    ],
    9:[
      ['Proton charge','Show that uud has charge +e.','+2/3 +2/3 −1/3 = +1 e.'],
      ['Meson B','Why does a meson have B = 0?','Quark +1/3 plus antiquark −1/3 = 0.'],
      ['Strangeness','What is S for s and s̄?','s has S = −1; s̄ has S = +1.'],
      ['Neutron decay','Use quark content to explain the neutron-to-proton change in β⁻ decay.','Neutron udd becomes proton uud because one d quark changes to u: d → u.']
    ],
    10:[
      ['Conservation list','Name the key quantities to check in a particle reaction.','Charge, baryon number, lepton number, energy, momentum and strangeness where relevant.'],
      ['β⁻ quark change','What quark changes in β⁻ decay?','d → u.'],
      ['Strong strangeness','What happens to total strangeness in a strong interaction?','It is conserved.']
    ],
    11:[
      ['Threshold','Why can intense low-frequency light still fail to emit electrons?','Each photon has hf < φ, so no photon has enough energy.'],
      ['Frequency','What happens to KEmax as frequency rises above threshold?','KEmax increases because hf = φ + KEmax.'],
      ['Intensity','What mainly changes when intensity rises at fixed frequency?','Photon arrival rate and therefore photoelectron emission rate.']
    ],
    12:[
      ['Excitation','Define excitation.','A bound electron moves to a higher allowed energy level.'],
      ['Ionisation','Define ionisation.','An electron is removed from the atom.'],
      ['Convert','Convert 10 eV to joules.','1.602 × 10⁻¹⁸ J.']
    ],
    13:[
      ['Photon from level','What happens in a downward energy transition?','A photon is emitted with energy equal to ΔE.'],
      ['Spectrum','Why are line spectra discrete?','Only certain allowed energy differences exist.'],
      ['Trend','Which gives shorter wavelength: large or small ΔE?','Large ΔE gives higher f and shorter λ.']
    ],
    14:[
      ['Equation','State the de Broglie relation.','λ = h/p.'],
      ['Momentum trend','What happens to λ if p doubles?','λ halves.'],
      ['Evidence pair','Give one particle-like and one wave-like piece of evidence.','Photoelectric effect for photons; electron diffraction for matter waves.']
    ],
    15:[
      ['Equation dump','Write five core equations without notes.','Examples: Q/m, E = hf, hf = φ + KEmax, ΔE = hf, λ = h/p.'],
      ['Link topics','How do electron collisions connect to line spectra?','Collisions excite atoms; de-excitation emits photons at discrete ΔE values.'],
      ['Self diagnosis','Choose one weak area and explain exactly what you still confuse.','Use the Mastery Map/Error Log to target the gap.']
    ],
    16:[
      ['Observation → inference','Most α particles pass straight through. What does this imply?','Most of the atom is empty space.'],
      ['Rare event','Why are large-angle deflections rare?','Only a small fraction pass very close to the tiny nucleus.'],
      ['Impact parameter','What happens as impact parameter decreases?','Closer approach gives stronger electrostatic repulsion and larger scattering angle.']
    ]
  };

  function taskBankHTML(n){
    const tasks=lessonTaskBank[n]||[];
    if(!tasks.length)return '';
    return '<div class="lesson-independent-tasks"><div class="lesson-task-heading"><span class="eyebrow">Independent practice</span><strong>'+tasks.length+' extra tasks</strong></div>'+
      tasks.map((t,i)=>'<details class="lesson-task-card"><summary><span>Task '+(i+1)+'</span>'+t[0]+' — '+t[1]+'</summary><div class="lesson-task-answer"><strong>Check:</strong> '+t[2]+'</div></details>').join('')+
      '</div>';
  }

  const CURRENT_STORE='particleLessonCurrentV2';
  const STAGE_STORE='particleLessonStagesV2';
  const VIEW_STORE='particleLessonViewV2';
  const stages=[
    {id:'recall',label:'Do Now',short:'Recall',time:'5 min'},
    {id:'objectives',label:'Objectives',short:'Goals',time:'2 min'},
    {id:'teach',label:'Teach',short:'Teach',time:'15–20 min'},
    {id:'simulate',label:'Simulation / activity',short:'Simulate',time:'15 min'},
    {id:'practice',label:'Worked example & exam practice',short:'Practice',time:'10–15 min'},
    {id:'exit',label:'Exit ticket',short:'Exit',time:'5 min'},
    {id:'next',label:'Homework & next lesson',short:'Next',time:'2 min'}
  ];

  let completed=new Set(),stageDone={},current=0,activeStage=0,lessonView='guided';
  try{completed=new Set(JSON.parse(localStorage.getItem(STORE)||'[]'))}catch{}
  try{stageDone=JSON.parse(localStorage.getItem(STAGE_STORE)||'{}')||{}}catch{}
  try{
    const saved=JSON.parse(localStorage.getItem(CURRENT_STORE)||'{}');
    if(Number.isInteger(saved.lesson))current=Math.max(0,Math.min(lessons.length-1,saved.lesson));
    if(Number.isInteger(saved.stage))activeStage=Math.max(0,Math.min(stages.length-1,saved.stage));
  }catch{}
  try{lessonView=localStorage.getItem(VIEW_STORE)||'guided'}catch{}

  function saveAll(){
    localStorage.setItem(STORE,JSON.stringify([...completed]));
    localStorage.setItem(STAGE_STORE,JSON.stringify(stageDone));
    localStorage.setItem(CURRENT_STORE,JSON.stringify({lesson:current,stage:activeStage}));
    localStorage.setItem(VIEW_STORE,lessonView);
    updateProgress();
  }

  function doneStagesFor(n){
    return new Set(stageDone[n]||[]);
  }

  function markStage(stageId,on=true){
    const l=lessons[current],set=doneStagesFor(l.n);
    if(on)set.add(stageId);else set.delete(stageId);
    stageDone[l.n]=[...set];
    if(set.size===stages.length)completed.add(l.n);
    else completed.delete(l.n);
    saveAll();
  }

  function setStage(i,scroll=false){
    activeStage=Math.max(0,Math.min(stages.length-1,i));
    lessonView='guided';
    saveAll();
    renderLesson();
    if(scroll){
      requestAnimationFrame(()=>$('#lessonPanel .lesson-active-section')?.scrollIntoView({behavior:'smooth',block:'nearest'}));
    }
  }

  function updateProgress(){
    const done=completed.size,total=lessons.length;
    if($('#overallProgressText'))$('#overallProgressText').textContent=done+' / '+total+' lessons complete';
    if($('#overallProgressBar'))$('#overallProgressBar').style.width=(done/total*100)+'%';
    if($('#lessonSequenceProgress'))$('#lessonSequenceProgress').textContent=done+' / '+total;
    if($('#lessonSequenceFill'))$('#lessonSequenceFill').style.width=(done/total*100)+'%';
    const currentDone=doneStagesFor(lessons[current]?.n).size;
    if($('#lessonStepProgress'))$('#lessonStepProgress').textContent=currentDone+' / '+stages.length+' steps';
    if($('#lessonStepFill'))$('#lessonStepFill').style.width=(currentDone/stages.length*100)+'%';
  }

  function openView(view,sim){
    document.querySelector('[data-view="'+view+'"]')?.click();
    if(view==='lab'&&sim){
      setTimeout(()=>{
        window.PARTICLELAB_CORE?.activateSim?.(sim);
        document.querySelector('.sim-tab[data-sim="'+sim+'"]')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
      },70);
    }
  }

  function phaseGroups(){
    const groups=[];
    for(const l of lessons){
      let g=groups.find(x=>x.phase===l.phase);
      if(!g){g={phase:l.phase,items:[]};groups.push(g)}
      g.items.push(l);
    }
    return groups;
  }

  function renderList(){
    const list=$('#courseList');if(!list)return;
    list.className='course-list lesson-sequence-sidebar';
    list.innerHTML=phaseGroups().map(g=>
      '<div class="lesson-phase-heading">'+g.phase+'</div>'+
      g.items.map(l=>{
        const i=lessons.indexOf(l),done=completed.has(l.n),stepCount=doneStagesFor(l.n).size;
        return '<button class="lesson-route-button '+(i===current?'active ':'')+(done?'complete':'')+'" data-seq-lesson="'+i+'">'+
          '<span class="lesson-route-number">'+(done?'✓':l.n)+'</span>'+
          '<span class="lesson-route-title"><strong>'+l.title+'</strong><span>'+l.code+' · '+stepCount+'/'+stages.length+' steps</span></span>'+
          '<span class="lesson-route-status">'+(done?'done':(i===current?'now':''))+'</span></button>';
      }).join('')
    ).join('');
    $$('[data-seq-lesson]',list).forEach(b=>b.onclick=()=>{
      current=+b.dataset.seqLesson;
      lessonView='guided';
      const nextUndone=stages.findIndex(s=>!doneStagesFor(lessons[current].n).has(s.id));
      activeStage=nextUndone<0?0:nextUndone;
      saveAll();renderList();renderLesson();
    });
  }

  function stageBody(l,stageId){
    if(stageId==='recall'){
      const older=[];
      if(current>0) older.push(lessons[current-1].exit[0]);
      if(current>1) older.push(lessons[current-2].exit[1]||lessons[current-2].exit[0]);
      return '<div class="lesson-retrieval-split"><div><strong>Prerequisite recall</strong><ol>'+l.recall.map(x=>'<li>'+x+'</li>').join('')+'</ol></div>'+
        (older.length?'<div><strong>Cumulative retrieval</strong><ol>'+older.map(x=>'<li>'+x+'</li>').join('')+'</ol><p class="small subtle">These questions deliberately revisit earlier lessons.</p></div>':'')+'</div>';
    }
    if(stageId==='objectives')return '<ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
    if(stageId==='teach')return '<div class="lesson-check-list">'+l.teach.map(x=>'<div class="lesson-check"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join('')+'</div>'+
      (l.equations.length?'<div class="lesson-key-equation">'+l.equations.map(x=>'<code>'+x+'</code>').join('')+'</div>':'');
    if(stageId==='simulate')return '<p>'+l.simTask+'</p>'+
      (l.n===1?'<div class="lesson-ready"><strong>Atom-builder goal:</strong> Complete the first four Atom Builder Practice targets in order. They teach Z → A → neutrons → electrons before the sodium-23 question.</div>':'')+
      '<div class="lesson-actions-sequence lesson-inline-actions">'+
      (l.sim?'<button class="button primary" id="sequenceActivity">Open '+l.title+' simulation</button>':'<button class="button primary" id="sequenceActivity">'+(l.viewLabel||'Open activity')+'</button>')+
      (l.n===1?'<button class="button" id="sequenceAtomPractice">Open atom-builder practice</button>':'')+
      '<button class="button" id="sequenceFullTools">Open full learning tools</button></div>';
    if(stageId==='practice')return '<p><strong>Worked example:</strong> '+l.worked+'</p><p><strong>Exam wording:</strong> '+l.exam+'</p>'+taskBankHTML(l.n)+'<div class="lesson-actions-sequence lesson-inline-actions"><button class="button primary" id="sequenceExamPractice">Open exam questions</button></div>';
    if(stageId==='exit')return '<ol>'+l.exit.map(x=>'<li>'+x+'</li>').join('')+'</ol><div class="lesson-ready"><strong>Ready to move on?</strong> Students should answer all three without the simulation or notes.</div>';
    return '<p><strong>Homework:</strong> '+l.homework+'</p><p><strong>Next lesson:</strong> '+l.next+'</p>'+
      (current<lessons.length-1?'<div class="lesson-next-preview"><span>Up next</span><strong>'+lessons[current+1].title+'</strong><p>'+lessons[current+1].overview+'</p></div>':'<div class="lesson-ready"><strong>Sequence complete.</strong> Use the Mastery Map and mixed quiz for targeted revision.</div>');
  }

  function sectionClass(id){
    return id==='recall'?'recall':id==='objectives'?'objective':id==='teach'?'teach':id==='simulate'?'sim':id==='practice'?'practice':id==='exit'?'exit':'next';
  }

  function renderGuidedContent(l){
    const step=stages[activeStage],done=doneStagesFor(l.n),isDone=done.has(step.id);
    return '<div class="lesson-current-step">'+
      '<div class="lesson-now-banner"><div><span class="eyebrow">Do this now · Step '+(activeStage+1)+' of '+stages.length+'</span><h3>'+step.label+'</h3><p>'+step.time+'</p></div>'+
      '<div class="lesson-step-progress"><span id="lessonStepProgress">'+done.size+' / '+stages.length+' steps</span><div class="lesson-route-track compact"><div id="lessonStepFill" class="lesson-route-fill" style="width:'+(done.size/stages.length*100)+'%"></div></div></div></div>'+
      '<section class="lesson-section '+sectionClass(step.id)+' lesson-active-section"><span class="lesson-mini-time">'+step.time+'</span><h3>'+step.label+'</h3>'+stageBody(l,step.id)+'</section>'+
      '<div class="lesson-step-actions">'+
        '<button class="button" id="lessonStepBack" '+(activeStage===0?'disabled':'')+'>← Previous step</button>'+
        '<button class="button primary" id="lessonStepDone">'+(isDone?'✓ Done — next step':'Mark step done →')+'</button>'+
      '</div>'+
    '</div>';
  }

  function renderFullPlan(l){
    return '<div class="lesson-content lesson-full-plan">'+stages.map((s,i)=>
      '<section class="lesson-section '+sectionClass(s.id)+'" data-full-stage="'+i+'"><span class="lesson-mini-time">'+s.time+'</span><h3>'+s.label+'</h3>'+stageBody(l,s.id)+'</section>'
    ).join('')+'</div>';
  }

  function renderLesson(){
    const panel=$('#lessonPanel');if(!panel)return;
    const l=lessons[current],done=completed.has(l.n),doneSet=doneStagesFor(l.n);
    panel.className='panel lesson-route-panel';
    panel.innerHTML=
      '<div class="lesson-hero">'+
        (l.extension?'<div class="lesson-extension-banner"><strong>Extension:</strong> this is AQA 3.8.1.1 Nuclear Physics, not part of core section 3.2.</div>':'')+
        '<div class="lesson-hero-top"><span class="eyebrow">'+l.phase+' · '+l.code+'</span><span class="lesson-count">Lesson '+l.n+' of '+lessons.length+'</span></div>'+
        '<h2>'+l.title+'</h2><p>'+l.overview+'</p>'+
        '<div class="lesson-meta"><span>'+l.duration+'</span><span>'+l.objectives.length+' objectives</span><span>'+(l.sim?'3D simulation':'guided activity')+'</span></div>'+
      '</div>'+
      '<div class="lesson-view-toolbar"><div><span class="study-label">Lesson view</span><button class="study-mode-button '+(lessonView==='guided'?'active':'')+'" data-lesson-view="guided">Guided steps</button><button class="study-mode-button '+(lessonView==='full'?'active':'')+'" data-lesson-view="full">Full lesson plan</button></div><button class="text-button" id="resumeThisLesson">Jump to first unfinished step</button></div>'+
      '<div class="lesson-stage-strip">'+
        stages.map((s,i)=>'<button class="lesson-stage '+(i===activeStage?'active ':'')+(doneSet.has(s.id)?'done':'')+'" data-seq-stage="'+i+'"><span>'+(doneSet.has(s.id)?'✓':i+1)+'</span>'+s.short+'</button>').join('')+
      '</div>'+
      (lessonView==='guided'?renderGuidedContent(l):renderFullPlan(l))+
      '<div class="lesson-actions-sequence lesson-footer-actions"><button class="button '+(done?'success':'')+'" id="sequenceComplete">'+(done?'✓ Lesson complete':'Complete remaining steps to finish lesson')+'</button></div>'+
      '<div class="lesson-nav-row"><button class="button" id="sequencePrev" '+(current===0?'disabled':'')+'>← Previous lesson</button><button class="button" id="sequenceNext" '+(current===lessons.length-1?'disabled':'')+'>Next lesson →</button></div>';

    $$('[data-seq-stage]',panel).forEach(b=>b.onclick=()=>setStage(+b.dataset.seqStage,true));
    $$('[data-lesson-view]',panel).forEach(b=>b.onclick=()=>{lessonView=b.dataset.lessonView;saveAll();renderLesson();});
    $('#resumeThisLesson').onclick=()=>{
      const i=stages.findIndex(s=>!doneStagesFor(l.n).has(s.id));
      setStage(i<0?0:i,true);
    };

    const bindActivity=()=>{
      $('#sequenceActivity')?.addEventListener('click',()=>l.sim?openView('lab',l.sim):openView(l.view||'quiz'));
      $('#sequenceAtomPractice')?.addEventListener('click',()=>{openView('lab','atom');setTimeout(()=>window.PARTICLELAB_ATOM_PRACTICE?.open?.(0),120)});
      $('#sequenceExamPractice')?.addEventListener('click',()=>{openView('lab',l.sim||'atom');setTimeout(()=>document.querySelector('[data-lt="exam"]')?.click(),120)});
      $('#sequenceFullTools')?.addEventListener('click',()=>{if(l.sim){openView('lab',l.sim);setTimeout(()=>document.querySelector('[data-study-mode="full"]')?.click(),120)}else openView('learninghub')});
    };
    bindActivity();

    $('#lessonStepBack')?.addEventListener('click',()=>{if(activeStage>0)setStage(activeStage-1)});
    $('#lessonStepDone')?.addEventListener('click',()=>{
      markStage(stages[activeStage].id,true);
      if(activeStage<stages.length-1){
        activeStage++;
        saveAll();renderList();renderLesson();
      }else{
        completed.add(l.n);saveAll();renderList();renderLesson();
      }
    });

    $('#sequenceComplete').onclick=()=>{
      if(done){
        completed.delete(l.n);stageDone[l.n]=[];saveAll();activeStage=0;renderList();renderLesson();
      }else{
        const first=stages.findIndex(s=>!doneStagesFor(l.n).has(s.id));
        if(first>=0)setStage(first);
      }
    };
    $('#sequencePrev').onclick=()=>changeLesson(-1);
    $('#sequenceNext').onclick=()=>changeLesson(1);
    updateProgress();
  }

  function changeLesson(delta){
    const next=current+delta;
    if(next<0||next>=lessons.length)return;
    current=next;
    const first=stages.findIndex(s=>!doneStagesFor(lessons[current].n).has(s.id));
    activeStage=first<0?0:first;
    saveAll();renderList();renderLesson();scrollCourseTop();
  }

  function scrollCourseTop(){
    $('#view-course')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderSummary(){
    const section=$('#view-course');if(!section)return;
    const head=$('.section-head',section);
    if(head){
      head.innerHTML='<div><span class="eyebrow">Classroom teaching route</span><h2>Particles & Radiation lesson sequence</h2></div><p class="subtle">Open one lesson, follow the highlighted step, then press “Mark step done” to move through it.</p>';
    }
    let summary=$('#lessonRouteSummary');
    if(!summary){
      summary=document.createElement('div');
      summary.id='lessonRouteSummary';summary.className='lesson-route-summary';
      head?.insertAdjacentElement('afterend',summary);
    }
    const l=lessons[current],step=stages[activeStage];
    summary.innerHTML='<div class="lesson-route-overview"><span class="eyebrow">Continue where you left off</span><h3>Lesson '+l.n+' · '+l.title+'</h3><p>Current step: <strong>'+step.label+'</strong>. The app remembers this lesson and step on this device.</p><div class="lesson-route-phases">'+
      phaseGroups().map(g=>'<span class="lesson-phase-chip">'+g.phase+' · '+g.items.length+' lessons</span>').join('')+
      '</div><button class="button primary" id="resumeLessonSequence" style="margin-top:8px">Continue lesson '+l.n+'</button></div>'+
      '<div class="lesson-route-progress"><div class="lesson-progress-line"><div><span class="eyebrow">Sequence progress</span><h3 id="lessonSequenceProgress"></h3></div><strong>'+lessons.length+'</strong></div><div class="lesson-route-track"><div id="lessonSequenceFill" class="lesson-route-fill"></div></div><p style="margin-top:6px">A lesson completes after all seven steps are ticked.</p></div>';
    $('#resumeLessonSequence').onclick=()=>{$('#lessonPanel')?.scrollIntoView({behavior:'smooth',block:'start'})};
    const layout=$('.course-layout',section);
    layout?.classList.add('lesson-sequence-layout');
  }

  function relabelNavigation(){
    const nav=$('.nav-button[data-view="course"]');if(nav)nav.textContent='Lesson sequence';
    const jump=$('[data-jump="course"]');if(jump)jump.textContent='Continue lesson sequence';
  }

  function init(){
    relabelNavigation();
    renderSummary();
    renderList();
    renderLesson();
    updateProgress();

    $('#resetProgress')?.addEventListener('click',()=>{
      setTimeout(()=>{
        completed.clear();stageDone={};current=0;activeStage=0;saveAll();renderSummary();renderList();renderLesson();
      },0);
    });

    setInterval(()=>{
      if(!$('#view-course'))return;
      const now=$('#courseList')?.className||'';
      if(!now.includes('lesson-sequence-sidebar')){
        renderSummary();renderList();renderLesson();updateProgress();
      }
    },800);
  }

  window.PARTICLELAB_LESSON_SEQUENCE={
    lessons,
    stages,
    taskBank:lessonTaskBank,
    openStage:i=>setStage(i,true),
    openLesson:n=>{
      const i=lessons.findIndex(l=>l.n===n);
      if(i>=0){
        current=i;
        lessonView='guided';
        const first=stages.findIndex(s=>!doneStagesFor(lessons[current].n).has(s.id));
        activeStage=first<0?0:first;
        saveAll();
        document.querySelector('[data-view="course"]')?.click();
        renderSummary();renderList();renderLesson();
      }
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,380),{once:true});
  else setTimeout(init,380);
})();
