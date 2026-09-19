// Probe rect các element tràn trên mobile.
import { chromium } from 'playwright';
const b = await chromium.launch();
const uid = Date.now();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
await p.goto('https://keode.netlify.app/', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: '#nl-badge-frame,[data-nl-ready]{display:none!important}' });
await p.evaluate(() => localStorage.clear());
await p.fill('#regName', 'Rect Probe');
await p.fill('#regEmail', `rect-${uid}@keo.vn`);
await p.fill('#regPass', 'keode123');
await p.click('#regBtn');
await p.waitForSelector('#view-onboard:not(.hide)', { timeout: 20000 });
await p.fill('#obDob', '2000-01-01');
await p.click('#obNext');
await p.click('#obDistricts .pchip:nth-child(1)');
await p.click('#obLikes .pchip:nth-child(1)');
await p.click('#obDone');
await p.waitForSelector('#view-app:not(.hide)');
await p.waitForTimeout(3000);
await p.click('.fab');
await p.click('#catRadios .rchip:nth-child(6) input', { force: true });
const dump = label => p.evaluate(l => {
  const vw = document.documentElement.clientWidth;
  return [...document.querySelectorAll('body *')].filter(el => {
    const r = el.getBoundingClientRect();
    return el.offsetParent !== null && (r.right > vw + 1 || r.left < -1) &&
      !el.closest('.pstrip') && !el.closest('.circles') && !el.closest('.atwrap') &&
      getComputedStyle(el).position !== 'fixed';
  }).slice(0, 5).map(el => {
    const r = el.getBoundingClientRect();
    return {
      tag: el.tagName, cls: String(el.className).slice(0, 30), id: el.id,
      left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width),
      parent: (el.parentElement && (el.parentElement.id || String(el.parentElement.className).slice(0, 22))) || ''
    };
  }).concat([{ label: l, vw }]);
}, label);
console.log('MODAL:', JSON.stringify(await dump('modal'), null, 1));
await p.fill('#fname', 'T');
await p.fill('#fFrom', 'A');
await p.fill('#fTo', 'B');
const d = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
await p.fill('#fdate', d);
await p.fill('#ftime', '06:00');
await p.click('#kform .btn-p');
await p.waitForTimeout(500);
await p.click('#feed .kcard .kbtns [data-act="view"]');
await p.waitForTimeout(500);
console.log('DETAIL:', JSON.stringify(await dump('detail'), null, 1));
await b.close();
