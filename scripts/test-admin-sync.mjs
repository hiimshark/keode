// Test: Admin panel (trình duyệt khác) phải thấy kèo cloud của user A.
import { chromium } from 'playwright';
const URL = 'https://keode.netlify.app/';
const uid = Date.now();
const errs = [];
const b = await chromium.launch();

// 1. User A tạo kèo trên cloud
const c1 = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p1 = await c1.newPage();
p1.on('pageerror', e => errs.push('A ERR: ' + e.message));
await p1.goto(URL, { waitUntil: 'networkidle' });
await p1.fill('#regName', 'User A');
await p1.fill('#regEmail', 'ad-a-' + uid + '@keo.vn');
await p1.fill('#regPass', 'keode123');
await p1.click('#regBtn');
await p1.waitForSelector('#view-onboard:not(.hide)', { timeout: 20000 });
await p1.fill('#obDob', '2000-01-01');
await p1.click('#obNext');
await p1.click('#obDistricts .pchip:nth-child(1)');
await p1.click('#obLikes .pchip:nth-child(1)');
await p1.click('#obDone');
await p1.waitForSelector('#view-app:not(.hide)');
for (let i = 0; i < 30; i++) {
  const bd = (await p1.textContent('#modeBadge')).trim();
  if (bd.startsWith('☁️ Cloud') && !bd.includes('Đang')) break;
  await p1.waitForTimeout(1000);
}
const d = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
await p1.click('.topbar .js-open-modal');
await p1.fill('#fname', 'Kèo của A cho admin xem ' + uid);
await p1.fill('#fplace', 'Quán A');
await p1.selectOption('#fDistrict', 'Quận 1');
await p1.fill('#fdate', d);
await p1.fill('#ftime', '19:00');
await p1.click('#kform .btn-p');
await p1.waitForTimeout(2000);

// 2. Admin panel ở TRÌNH DUYỆT KHÁC
const c2 = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p2 = await c2.newPage();
p2.on('pageerror', e => errs.push('ADMIN ERR: ' + e.message));
await p2.goto(URL + '#admin', { waitUntil: 'networkidle' });
await p2.fill('#admPass', 'admin123');
await p2.click('#admLoginBtn');
await p2.waitForSelector('#adminPanel:not(.hide)');
for (let i = 0; i < 30; i++) {
  const badge = (await p2.textContent('#modeBadge')).trim();
  if (badge.startsWith('☁️ Cloud') && !badge.includes('Đang')) break;
  await p2.waitForTimeout(1000);
}
await p2.click('#atabs .tab[data-at="keos"]');
await p2.waitForTimeout(800);
const rows = (await p2.locator('#akeosTable tr').count()) - 1;
const hasA = await p2.locator('#akeosTable:has-text("Kèo của A cho admin xem ' + uid + '")').count();
console.log('ADMIN (trình duyệt khác) | badge:', (await p2.textContent('#modeBadge')).trim().slice(0, 12),
  '| số kèo trong bảng =', rows, '| thấy kèo của A?', hasA > 0);
await p2.screenshot({ path: 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos/admin-cloud-sync.png' });
console.log(errs.length ? 'ERRORS:\n' + errs.join('\n') : 'ZERO pageerrors');
await b.close();
