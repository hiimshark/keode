// Kiểm chứng cloud LIVE: 2 trình duyệt độc lập, 2 tài khoản email thật (Firebase),
// user A tạo kèo → user B thấy kèo + xin tham gia → user A thấy số chỗ cập nhật real-time.
import { chromium } from 'playwright';

const URL = 'https://keode.netlify.app/';
const errors = [];

const browser = await chromium.launch();

async function newUser(email, name) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errors.push(name + ' pageerror: ' + e.message));
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.fill('#regName', name);
  await p.fill('#regEmail', email);
  await p.fill('#regPass', 'keode123');
  await p.click('#regBtn');
  await p.waitForSelector('#view-onboard:not(.hide)', { timeout: 20000 });
  await p.fill('#obDob', '2000-01-01');
  await p.click('#obNext');
  await p.click('#obDistricts .pchip:nth-child(1)');
  await p.click('#obLikes .pchip:nth-child(1)');
  await p.click('#obDone');
  await p.waitForSelector('#view-app:not(.hide)');
  await p.waitForTimeout(2500); // chờ initCloud kết nối Firestore
  return { ctx, p };
}

console.log('== Tạo user A (chủ kèo) ==');
const A = await newUser('cloud-test-a@keo.vn', 'Chủ Kèo A');
const modeA = await A.p.textContent('#modeBadge');
console.log('A | mode badge:', modeA.trim().slice(0, 20));

console.log('== A tạo kèo ==');
await A.p.click('.topbar .js-open-modal');
await A.p.fill('#fname', 'Kèo cloud test — cà phê thử sync');
await A.p.fill('#fplace', 'The Coffee House Bách Tùng Diệp');
await A.p.selectOption('#fDistrict', 'Quận 1');
const d = new Date(Date.now() + 3600 * 1000 * 24).toISOString().slice(0, 10);
await A.p.fill('#fdate', d);
await A.p.fill('#ftime', '19:00');
await A.p.fill('#fnum', '6');
await A.p.click('#kform .btn-p');
await A.p.waitForTimeout(2000);
console.log('A | cards =', await A.p.locator('#feed .kcard').count(),
  '| toast:', (await A.p.textContent('#toast')).slice(0, 30));

console.log('== Tạo user B (người tham gia) ==');
const B = await newUser('cloud-test-b@keo.vn', 'Thành Viên B');
await B.p.waitForTimeout(2000);
const modeB = await B.p.textContent('#modeBadge');
console.log('B | mode badge:', modeB.trim().slice(0, 20));

console.log('== B có thấy kèo của A? ==');
const seen = await B.p.locator('#feed .kcard:has-text("Kèo cloud test — cà phê thử sync")').count();
console.log('B | kèo của A hiện trong feed:', seen === 1);

if (seen === 1) {
  console.log('== B xin tham gia ==');
  await B.p.click('#feed .kcard:has-text("Kèo cloud test") .btn.btn-p[data-act="join"]');
  await B.p.waitForTimeout(2500);
  console.log('B | nút chuyển:', (await B.p.textContent('#feed .kcard:has-text("Kèo cloud test") [data-act="join"]')).trim());
  console.log('B | slot:', (await B.p.textContent('#feed .kcard:has-text("Kèo cloud test") .tnum')).trim());

  console.log('== A thấy cập nhật real-time? ==');
  await A.p.bringToFront();
  await A.p.waitForTimeout(3000);
  console.log('A | slot (không reload):', (await A.p.textContent('#feed .kcard .tnum')).trim(),
    '| members count trong chi tiết sẽ là 2/6');
  await A.p.screenshot({ path: 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos/cloud-live-A.png' });
  await B.p.screenshot({ path: 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos/cloud-live-B.png' });
}

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ZERO pageerrors');
await browser.close();
