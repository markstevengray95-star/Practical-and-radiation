
import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const expected = [
  'atom','specific','strong','decay','antimatter','interactions','classification',
  'quarks','photo','collisions','levels','diffraction','rutherford'
];

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
const pageErrors = [];
page.on('pageerror', err => pageErrors.push(String(err)));
page.on('console', msg => {
  if (msg.type() === 'error') pageErrors.push('console: ' + msg.text());
});

try {
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('[data-view="lab"]').click();
  await page.waitForSelector('#simNav .sim-tab', { timeout: 10000 });

  const ids = await page.locator('#simNav .sim-tab').evaluateAll(nodes => nodes.map(n => n.dataset.sim));
  if (JSON.stringify(ids) !== JSON.stringify(expected)) {
    throw new Error('Simulation registry mismatch: ' + JSON.stringify(ids));
  }

  try {
    await page.waitForFunction(() => {
      const t = document.querySelector('#renderStatus')?.textContent || '';
      return t && !/loading 3d engine/i.test(t);
    }, null, { timeout: 15000 });
  } catch (err) {
    console.error('Renderer status:', await page.locator('#renderStatus').textContent().catch(() => 'missing'));
    console.error('Browser errors:', pageErrors);
    throw err;
  }
  const rendererStatus = (await page.locator('#renderStatus').textContent())?.trim() || '';
  if (!/3D model ready/i.test(rendererStatus)) {
    throw new Error('Expected real 3D renderer, got: ' + rendererStatus + '\n' + pageErrors.join('\n'));
  }

  const results = [];
  for (const id of expected) {
    const tab = page.locator('#simNav .sim-tab[data-sim="' + id + '"]');
    await tab.click();
    await page.waitForTimeout(120);

    const title = (await page.locator('#simTitle').textContent())?.trim();
    const controlsText = (await page.locator('#simControls').textContent())?.trim();
    const readoutText = (await page.locator('#simReadout').textContent())?.trim();

    if (!title) throw new Error(id + ': missing title');
    if (!controlsText) throw new Error(id + ': missing controls');
    if (!readoutText || /loading interactive model/i.test(readoutText)) {
      throw new Error(id + ': readout did not initialize');
    }

    const select = page.locator('#simControls select').first();
    if (await select.count()) {
      const options = await select.locator('option').evaluateAll(os => os.map(o => o.value));
      if (options.length > 1) {
        await select.selectOption(options[options.length - 1]);
        await page.waitForTimeout(80);
      }
    }

    const range = page.locator('#simControls input[type="range"]').first();
    if (await range.count()) {
      await range.evaluate(el => {
        const min = Number(el.min || 0), max = Number(el.max || 100);
        el.value = String(min + (max - min) * 0.62);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(80);
    }

    const action = page.locator('#simControls button').first();
    if (await action.count()) {
      await action.click();
      await page.waitForTimeout(100);
    }

    const after = (await page.locator('#simReadout').textContent())?.trim();
    if (!after) throw new Error(id + ': readout disappeared after interaction');

    await page.waitForSelector('#simReadout .sim-readout-flow', { timeout: 3000 });
    const keyStrip = page.locator('#simKeyStrip');
    if (!(await keyStrip.count())) throw new Error(id + ': missing key-information strip');
    const keyText = (await keyStrip.textContent())?.trim();
    if (!keyText) throw new Error(id + ': key-information strip is empty');

    const legend = page.locator('#simParticleLegend');
    if (!(await legend.count())) throw new Error(id + ': missing model key');
    const legendText = (await legend.textContent())?.trim() || '';
    if (legendText.includes('Target ring')) throw new Error(id + ': obsolete target-ring legend is still visible');

    const guide = page.locator('#simObjectGuide');
    if (!(await guide.count())) throw new Error(id + ': missing external model guide');
    const guideButtons = guide.locator('.sim-guide-button');
    if ((await guideButtons.count()) < 1) throw new Error(id + ': model guide has no explanatory items');

    const sideOverflow = await page.locator('.lab-side').evaluate(el => el.scrollWidth > el.clientWidth + 4);
    if (sideOverflow) throw new Error(id + ': simulation information column has horizontal overflow');

    const essentials = page.locator('#simEssentials');
    if (!(await essentials.count())) throw new Error(id + ': missing exam essentials panel');
    const essentialText = (await essentials.textContent())?.trim() || '';
    if (!essentialText.includes('Must know') || !essentialText.includes('Exam technique')) {
      throw new Error(id + ': essentials tabs are incomplete');
    }
    const specPill = (await page.locator('#studySpecPill').textContent())?.trim() || '';
    if (!specPill) throw new Error(id + ': missing AQA specification tag');

    const coach = page.locator('#simChangeCoach');
    if (!(await coach.count())) throw new Error(id + ': missing live change coach');
    const coachText = (await coach.textContent())?.trim() || '';
    for (const phrase of ['What you should see','Why it happens','Exam connection','Try next']) {
      if (!coachText.includes(phrase)) throw new Error(id + ': live coach missing ' + phrase);
    }

    results.push({ id, title, ok: true });
  }

  const focusButton = page.locator('[data-study-mode="focus"]');
  const fullButton = page.locator('[data-study-mode="full"]');
  if (!(await focusButton.count()) || !(await fullButton.count())) throw new Error('Student Focus / Full tools controls are missing');
  await focusButton.click();
  if (!(await page.locator('body').evaluate(el => el.classList.contains('sim-focus-mode')))) throw new Error('Focus view did not activate');
  await fullButton.click();
  if (!(await page.locator('body').evaluate(el => el.classList.contains('sim-full-mode')))) throw new Error('Full tools view did not activate');

  const fullGuide = page.locator('#simObjectGuide .sim-guide-button').first();
  if (!(await fullGuide.isVisible())) throw new Error('Model guide is not visible in Full tools mode');
  await fullGuide.click();
  await page.waitForTimeout(40);
  const selectedGuideText = (await page.locator('#live3DSelected').textContent())?.trim() || '';
  if (!selectedGuideText || /use the model guide/i.test(selectedGuideText)) throw new Error('Model guide did not update the explanation panel in Full tools mode');

  await focusButton.click();

  const soundButton = page.locator('#simSoundToggle');
  const soundTest = page.locator('#simSoundTest');
  if (!(await soundButton.count()) || !(await soundTest.count())) throw new Error('Simulation sound controls are missing');
  const soundApi = await page.evaluate(() => ({
    exists: !!window.PARTICLELAB_SOUND,
    hasTest: typeof window.PARTICLELAB_SOUND?.test === 'function',
    hasCue: typeof window.PARTICLELAB_SOUND?.cue === 'function'
  }));
  if (!soundApi.exists || !soundApi.hasTest || !soundApi.hasCue) throw new Error('Simulation sound API is not wired');
  await soundTest.click();
  await page.waitForTimeout(80);

  // Complete-beginner pathway checks.
  const startNav = page.locator('[data-view="starthere"]');
  if (!(await startNav.count())) throw new Error('Start Here navigation missing');
  await startNav.click();
  await page.waitForSelector('#view-starthere.active-view', { timeout: 5000 });
  if ((await page.locator('[data-dq]').count()) < 12) throw new Error('Beginner diagnostic is incomplete');
  if ((await page.locator('[data-bridge]').count()) < 6) throw new Error('Prerequisite bridge is incomplete');
  if (!(await page.locator('#beginLesson1').count())) throw new Error('Begin Lesson 1 action missing');

  // Revision hub checks.
  const revisionNav = page.locator('[data-view="revisionhub"]');
  if (!(await revisionNav.count())) throw new Error('Revision Hub navigation missing');
  await revisionNav.click();
  await page.waitForSelector('#view-revisionhub.active-view', { timeout: 5000 });
  for (const tab of ['today','flash','mixed','formula','definitions','glossary','spec','errors']) {
    if (!(await page.locator('[data-revision-tab="' + tab + '"]').count())) throw new Error('Missing revision tab: ' + tab);
  }
  await page.locator('[data-revision-tab="glossary"]').click();
  await page.waitForTimeout(60);
  if ((await page.locator('.glossary-entry').count()) < 30) throw new Error('Glossary is too small');
  await page.locator('[data-revision-tab="spec"]').click();
  await page.waitForTimeout(60);
  if ((await page.locator('[data-spec]').count()) < 30) throw new Error('Specification checklist is incomplete');

  // AQA Physics exam-skills coach checks.
  const examSkillsNav = page.locator('[data-view="examskills"]');
  if (!(await examSkillsNav.count())) throw new Error('Exam Skills navigation missing');
  await examSkillsNav.click();
  await page.waitForSelector('#view-examskills.active-view', { timeout: 5000 });
  if ((await page.locator('.command-card').count()) < 8) throw new Error('Command-word coach is incomplete');
  if ((await page.locator('[data-worked]').count()) < 8) throw new Error('Worked-example bank is incomplete');
  if ((await page.locator('.mark-killer').count()) < 8) throw new Error('Common-error coaching is incomplete');

  // Classroom lesson sequence checks.
  await page.locator('[data-view="course"]').click();
  await page.waitForSelector('#courseList.lesson-sequence-sidebar', { timeout: 5000 });
  const sequenceButtons = page.locator('[data-seq-lesson]');
  if ((await sequenceButtons.count()) !== 16) throw new Error('Expected 16 teaching-sequence lessons');
  const firstLessonText = (await sequenceButtons.first().textContent()) || '';
  if (!/Atomic structure/i.test(firstLessonText)) throw new Error('Lesson 1 is not atomic structure');

  await sequenceButtons.first().click();
  await page.waitForTimeout(80);
  if (!(await page.locator('.lesson-current-step').count())) throw new Error('Guided current-step view is missing');
  const beforeStep = (await page.locator('#lessonStepProgress').textContent()) || '';
  await page.locator('#lessonStepDone').click();
  await page.waitForTimeout(80);
  const afterStep = (await page.locator('#lessonStepProgress').textContent()) || '';
  if (beforeStep === afterStep) throw new Error('Lesson step progress did not advance');
  await page.locator('[data-lesson-view="full"]').click();
  await page.waitForTimeout(50);
  if (!(await page.locator('.lesson-full-plan').count())) throw new Error('Full lesson plan view did not open');
  await page.locator('[data-lesson-view="guided"]').click();
  await page.waitForTimeout(50);

  const lastLessonText = (await sequenceButtons.last().textContent()) || '';
  if (!/Rutherford/i.test(lastLessonText)) throw new Error('Lesson 16 is not Rutherford extension');
  if (!(await page.locator('#lessonSequenceProgress').count())) throw new Error('Lesson sequence progress is missing');

  await sequenceButtons.nth(10).click();
  await page.waitForTimeout(80);
  const lesson11Title = (await page.locator('#lessonPanel h2').textContent()) || '';
  if (!/Photoelectric/i.test(lesson11Title)) throw new Error('Lesson 11 is not photoelectric effect');
  await page.locator('#sequenceActivity').click();
  await page.waitForTimeout(120);
  if (!(await page.locator('#view-lab').evaluate(el => el.classList.contains('active-view')))) throw new Error('Lesson activity did not open the simulation lab');
  if (!(await page.locator('.sim-tab[data-sim="photo"]').evaluate(el => el.classList.contains('active')))) throw new Error('Lesson 11 did not launch photoelectric simulation');

  // Feature suite checks.
  await page.locator('[data-view="lab"]').click();
  await page.waitForSelector('#learningSuite', { state: 'attached', timeout: 5000 });
  for (const tool of ['inspector','compare','graphs','measure','practical','exam']) {
    if (!(await page.locator('#lt-' + tool).count())) throw new Error('Missing learning tool: ' + tool);
  }
  if (!(await page.locator('#measureOverlay').count())) throw new Error('Measurement overlay missing');

  const learningSuite = page.locator('#learningSuite');
  if (await learningSuite.isVisible()) throw new Error('Learning Tools should be hidden in Focus mode');
  await page.locator('[data-study-mode="full"]').click();
  await page.waitForTimeout(80);
  if (!(await learningSuite.isVisible())) throw new Error('Learning Tools did not become visible in Full tools mode');
  await page.locator('[data-study-mode="focus"]').click();

  const hubNav = page.locator('[data-view="learninghub"]');
  if (!(await hubNav.count())) throw new Error('Learning Tools navigation missing');
  await hubNav.click();
  await page.waitForSelector('#view-learninghub.active-view', { timeout: 5000 });
  for (const panel of ['mastery','teacher','challenge','feynman','history','access','language']) {
    if (!(await page.locator('#hub-' + panel).count())) throw new Error('Missing learning hub panel: ' + panel);
  }

  await page.locator('[data-hub="language"]').click();
  await page.locator('[data-lang="zh"]').click();
  await page.waitForTimeout(120);
  if ((await page.locator('html').getAttribute('lang')) !== 'zh-CN') throw new Error('Mandarin mode did not activate');
  await page.locator('[data-lang="en"]').click();
  await page.waitForTimeout(80);
  if ((await page.locator('html').getAttribute('lang')) !== 'en') throw new Error('English mode did not restore');

  await page.locator('[data-view="rutherfordexp"]').click();
  await page.waitForSelector('#rutherfordExperimentCanvas', { state: 'visible', timeout: 10000 });
  await page.waitForFunction(() => {
    const t = document.querySelector('#ruth3DStatus')?.textContent || '';
    return /3D ready/i.test(t);
  }, null, { timeout: 15000 });

  await page.locator('#ruthFireOne').click();
  await page.waitForTimeout(150);
  await page.locator('[data-ruth-mode="closeup"]').click();
  await page.waitForTimeout(150);
  const angle = (await page.locator('#ruthAngleReadout').textContent())?.trim();
  if (!angle || !angle.includes('θ')) throw new Error('Rutherford close-up did not calculate scattering angle');

  if (pageErrors.length) {
    throw new Error('Browser errors:\n' + [...new Set(pageErrors)].join('\n'));
  }

  console.log('Simulation smoke test passed:', results.map(r => r.id).join(', '));
  console.log('Rutherford 3D apparatus and close-up passed.');
} finally {
  await browser.close();
}
