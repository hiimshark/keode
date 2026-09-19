// Test v0.9 — tạo tài khoản email, KYC CCCD, admin duyệt, badge, policy.
import { chromium } from 'playwright';
import fs from 'fs';

const FILE = 'file:///C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/keo-de.html';
const OUT = 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos';
const CCCD = 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/assets/_test-cccd.png';
const SELFIE = 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/assets/_test-selfie.png';
const errors = [];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

// 1. ĐĂNG KÝ tài khoản email mới
await page.goto(FILE, { waitUntil: 'networkidle' });
console.log('regbox hiện?', await page.locator('.regbox').count() === 1);
await page.fill('#regName', 'Người Dùng Test');
await page.fill('#regEmail', 'test@keo.vn');
await page.fill('#regPass', 'secret1');
await page.click('#regBtn');
await page.waitForSelector('#view-onboard:not(.hide)');
console.log('đăng ký → onboarding | tên từ tài khoản:', await page.inputValue('#obName'));
await page.fill('#obDob', '2000-01-01');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');

// 2. Banner CHƯA xác minh + tag trên kèo
await createK('Kèo test KYC', '20:00');
console.log('B1 | banner chưa XM?', (await page.textContent('#kycBanner')).includes('CHƯA XÁC MINH'),
  '| tag chủ kèo:', (await page.textContent('#feed .khost')).includes('Chưa XM'));

// 3. Gửi KYC: 2 ảnh + đồng ý
await page.click('#kybOpen');
await page.waitForSelector('#kycOverlay:not(.hide)');
await page.setInputFiles('#kcccd', CCCD);
await page.setInputFiles('#kselfie', SELFIE);
await page.waitForTimeout(300);
await page.check('#kAgree');
await page.click('#kycSubmit');
await page.waitForTimeout(300);
console.log('B2 | sau gửi: banner chờ duyệt?', (await page.textContent('#kycBanner')).includes('chờ duyệt'),
  '| kyc lưu?', await page.evaluate(() => (JSON.parse(localStorage.getItem('keode.kyc.v1'))||[]).length === 1));
await page.screenshot({ path: `${OUT}/v9-kyc-pending.png` });
await page.click('#kycClose');

// 4. ADMIN duyệt
await page.goto(FILE + '#admin', { waitUntil: 'networkidle' });
await page.fill('#admPass', 'admin123');
await page.click('#admLoginBtn');
await page.waitForSelector('#adminPanel:not(.hide)');
await page.click('#atabs .tab[data-at="kyc"]');
await page.waitForTimeout(200);
console.log('C1 | hàng chờ có hồ sơ?', (await page.textContent('#adminBody')).includes('Người Dùng Test'),
  '| 2 ảnh hiện?', await page.locator('.kthumb').count() === 2);
await page.screenshot({ path: `${OUT}/v9-admin-kyc.png` });
await page.click('[data-act="kycok"]');
await page.waitForTimeout(300);
console.log('C2 | duyệt xong: hàng chờ rỗng?', (await page.textContent('#adminBody')).includes('Không có yêu cầu chờ duyệt'),
  '| verified map lưu?', await page.evaluate(() => !!localStorage.getItem('keode.verified.v1')));

// 5. User quay lại: badge ✓ + banner ✓ + policy CCCD
await page.goto(FILE + '#discover', { waitUntil: 'networkidle' });
console.log('D1 | banner ĐÃ XM?', (await page.textContent('#kycBanner')).includes('đã xác minh'),
  '| tag host ✓?', (await page.textContent('#feed .khost')).includes('✓ Đã XM'));
await page.goto(FILE + '#policy', { waitUntil: 'networkidle' });
await page.click('.ptab[data-pt="privacy"]');
console.log('D2 | policy có mục CCCD?', (await page.textContent('#policyBody')).includes('Xác minh danh tính (CCCD & selfie)'));
await page.screenshot({ path: `${OUT}/v9-policy.png` });

function createK(title, time) {
  return page.click('.topbar .js-open-modal').then(async () => {
    await page.fill('#fname', title);
    await page.fill('#fplace', 'Quán test');
    const d = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    await page.fill('#fdate', d);
    await page.fill('#ftime', time);
    await page.click('#kform .btn-p');
    await page.waitForTimeout(250);
  });
}

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ZERO page/console errors');
await browser.close();
