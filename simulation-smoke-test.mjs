
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

  await page.waitForFunction(() => {
    const t = document.querySelector('#renderStatus')?.textContent || '';
    return /3D model ready|fallback model ready/i.test(t);
  }, null, { timeout: 15000 });

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

    results.push({ id, title, ok: true });
  }

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
