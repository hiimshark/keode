// Click-through test cho keo-de.html v0.7 (cloud + OTP UI + policy + xoá kèo + tự ẩn + kèo khuya).
// Chạy: node scripts/test-keode.mjs   (file:// — Firebase thật chạy qua http://localhost:8787)
import { chromium } from 'playwright';

const FILE = 'file:///C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/keo-de.html';
const OUT = 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos';
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

// 0. POLICY — xem được khi CHƯA đăng nhập
await page.goto(FILE + '#policy', { waitUntil: 'networkidle' });
console.log('policy mở không cần login?', await page.locator('#view-policy:not(.hide)').count() === 1,
  '| điều khoản?', (await page.textContent('#policyBody')).includes('Quy tắc đăng kèo'));
await page.click('.ptab[data-pt="privacy"]');
console.log('tab quyền riêng tư (NĐ 13/2023):', (await page.textContent('#policyBody')).includes('Nghị định 13/2023'));
await page.click('.ptab[data-pt="safety"]');
console.log('tab an toàn:', (await page.textContent('#policyBody')).includes('3 nguyên tắc vàng'));
await page.screenshot({ path: `${OUT}/v7-policy.png` });

// 1. login sạch: config ships sẵn, OTP đã xoá
await page.goto(FILE, { waitUntil: 'networkidle' });
console.log('login hiện?', await page.locator('#view-login:not(.hide)').count() === 1,
  '| Google nút hiện (file:// dùng mock)?', await page.locator('#gMock:not(.hide),#gsiBtn:not(.hide)').count() >= 1,
  '| cfgBar ẩn cho khách?', await page.evaluate(() => getComputedStyle(document.getElementById('cfgBar')).display === 'none'),
  '| OTP đã xoá?', await page.locator('#phNum').count() === 0,
  '| config nạp?', await page.evaluate(() => !!(window.KEO_FIREBASE_CONFIG && window.KEO_FIREBASE_CONFIG.apiKey)));

// 2. vào onboarding (seed session demo)
await page.evaluate(() => localStorage.clear());
await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));
await page.evaluate(() => { location.hash = 'onboard'; });
await page.reload({ waitUntil: 'networkidle' });
await page.waitForSelector('#view-onboard:not(.hide)');
await page.fill('#obDob', '2004-11-27');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');
console.log('app vào | mode badge:', (await page.textContent('#modeBadge')).slice(0, 12));

// 3. tạo kèo KHUYA ở quán đối tác (22:30)
await page.click('.topbar .js-open-modal');
await page.click('#catRadios .rchip:nth-child(4) input', { force: true });
await page.fill('#fname', 'Nhậu khuya xem bóng của Vũ');
await page.fill('#fplace', 'Bia Kè Corner');
const d = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
await page.fill('#fdate', d);
await page.fill('#ftime', '22:30');
await page.fill('#fnum', '8');
const expDefault = await page.inputValue('#fexp');
await page.click('#kform .btn-p');
await page.waitForTimeout(200);
console.log('sau tạo: cards =', await page.locator('#feed .kcard').count(),
  '| chip kèo khuya =', await page.locator('.kcard .ctag.r:has-text("Kèo khuya")').count(),
  '| fexp default =', expDefault,
  '| radar pin =', await page.locator('#pins .pin').count());

// 4. chi tiết: cảnh báo khuya + nút xoá (host) + share
await page.click('#feed .kcard .kbtns [data-act="view"]');
await page.waitForSelector('#page-detail.on');
console.log('detail | cảnh báo khuya =', await page.locator('.latewarn').count(),
  '| nút xoá (host) =', await page.locator('#delBtn').count(),
  '| sticky:', (await page.textContent('#joinBtn')).trim());
await page.screenshot({ path: `${OUT}/v7-detail.png` });

// 5. XOÁ kèo (host) → feed rỗng
page.once('dialog', dlg => dlg.accept());
await page.click('#delBtn');
await page.waitForTimeout(300);
console.log('sau xoá: feed cards =', await page.locator('#feed .kcard').count(),
  '| toast:', (await page.textContent('#toast')).slice(0, 10));

// 6. tạo lại kèo thường (15:00, tự ẩn +1 ngày)
await page.click('.topbar .js-open-modal');
await page.fill('#fname', 'Cà phê làm việc buổi chiều');
await page.fill('#fplace', 'The Coffee House Nguyễn Huệ');
await page.selectOption('#fDistrict', 'Quận 1');
await page.fill('#fdate', d);
await page.fill('#ftime', '15:00');
await page.click('#kform .btn-p');
await page.waitForTimeout(200);
console.log('kèo thường: cards =', await page.locator('#feed .kcard').count(),
  '| chip khuya =', await page.locator('.kcard .ctag.r').count());

// 7. mine + venues (xác minh + FB/Zalo)
await page.click('.tab[data-route="mine"]');
console.log('mine host cards =', await page.locator('#mineHost .kcard').count());
await page.click('.tab[data-route="venues"]');
console.log('venues | vcard =', await page.locator('.vcard').count(),
  '| xác minh note =', await page.locator('text=Quán đã qua xác minh của chủ hệ thống').count(),
  '| FB link =', await page.locator('a[href*="SharkHunter01"]').count(),
  '| Zalo link =', await page.locator('a[href*="zalo.me/0328206839"]').count());
await page.screenshot({ path: `${OUT}/v7-venues.png` });
await page.fill('#vName', 'Quán Test');
await page.fill('#vPhone', '0909123456');
await page.click('#vform .btn-p');
await page.waitForTimeout(200);
console.log('venue req:', (await page.textContent('#vReqCnt')).trim());

// 8. reload giữ dữ liệu + hash #keo
await page.reload({ waitUntil: 'networkidle' });
console.log('reload | app?', await page.locator('#view-app:not(.hide)').count() === 1,
  '| cards =', await page.locator('#feed .kcard').count());
const id = await page.evaluate(() => JSON.parse(localStorage.getItem('keode.posts.v2'))[0].id);
await page.goto(FILE + '#keo/' + id, { waitUntil: 'networkidle' });
console.log('hash #keo | detail?', await page.locator('#page-detail.on').count() === 1);

// 9. logout → login lại (kèo còn)
await page.click('#uchip');
page.once('dialog', dlg => dlg.accept());
await page.click('#logoutBtn');
await page.waitForTimeout(200);
console.log('logout | login hiện?', await page.locator('#view-login:not(.hide)').count() === 1);
await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));
await page.evaluate(() => { location.hash = 'onboard'; });
await page.reload({ waitUntil: 'networkidle' });
await page.fill('#obDob', '2004-11-27');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');
console.log('login lại | cards =', await page.locator('#feed .kcard').count(), '(kèo cũ còn)');

const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
console.log('horizontal overflow:', hOverflow);
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ZERO page/console errors');
await browser.close();
