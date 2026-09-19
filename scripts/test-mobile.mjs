// Quét overflow + chụp ảnh mọi view trên mobile (390 & 360).
import { chromium } from 'playwright';

const URL = 'https://keode.netlify.app/';
const OUT = 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos';
const errors = [];

const browser = await chromium.launch();
const uid = Date.now();

async function scan(w, hgt, tag) {
  const ctx = await browser.newContext({ viewport: { width: w, height: hgt }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(tag + ' ERR: ' + e.message));

  // login bằng email test + onboarding nhanh qua seed
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await p.fill('#regName', 'Mobile ' + tag);
  await p.fill('#regEmail', `mob-${tag}-${uid}@keo.vn`);
  await p.fill('#regPass', 'keode123');
  await p.click('#regBtn');
  await p.waitForSelector('#view-onboard:not(.hide)', { timeout: 20000 });
  await p.fill('#obDob', '2000-01-01');
  await p.click('#obNext');
  await p.click('#obDistricts .pchip:nth-child(1)');
  await p.click('#obLikes .pchip:nth-child(1)');
  await p.click('#obDone');
  await p.waitForSelector('#view-app:not(.hide)');
  await p.waitForTimeout(3500);

  const scanPage = async label => {
    const o = await p.evaluate(() => ({
      doc: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      els: [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect();
        return el.offsetParent !== null && (r.right > document.documentElement.clientWidth + 1 || r.left < -1) &&
          !el.closest('.pstrip') && !el.closest('.circles') && !el.closest('.atwrap') &&
          getComputedStyle(el).position !== 'fixed';
      }).slice(0, 4).map(el => el.className.toString().slice(0, 40) || el.tagName)
    }));
    console.log(`${tag} | ${label} | overflow doc: ${o.doc}px | tràn: ${o.els.length ? o.els.join(', ') : 'không'}`);
  };

  await scanPage('discover');
  await p.screenshot({ path: `${OUT}/mob-${tag}-discover.png`, fullPage: false });

  // tạo kèo du lịch → xem modal + card
  await p.click('.fab');
  await p.click('#catRadios .rchip:nth-child(6) input', { force: true });
  await scanPage('modal-du-lịch');
  await p.fill('#fname', 'Phượt test mobile');
  await p.fill('#fFrom', 'Thủ Đức');
  await p.fill('#fTo', 'Vũng Tàu');
  const d = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  await p.fill('#fdate', d);
  await p.fill('#ftime', '05:30');
  await p.click('#kform .btn-p');
  await p.waitForTimeout(500);
  await scanPage('feed-sau-tạo');
  await p.screenshot({ path: `${OUT}/mob-${tag}-feed.png` });

  // detail
  await p.click('#feed .kcard .kbtns [data-act="view"]');
  await p.waitForTimeout(400);
  await scanPage('detail');
  await p.screenshot({ path: `${OUT}/mob-${tag}-detail.png` });
  await p.click('#backBtn');
  await p.waitForTimeout(300);

  // venues + admin
  await p.evaluate(() => { location.hash = 'venues'; });
  await p.waitForTimeout(400);
  await scanPage('venues');
  await p.evaluate(() => { location.hash = 'admin'; });
  await p.waitForTimeout(600);
  await scanPage('admin-login');
  await ctx.close();
}

await scan(390, 844, '390');
await scan(360, 800, '360');

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ZERO pageerrors');
await browser.close();
