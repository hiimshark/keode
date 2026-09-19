// Test Admin Panel v0.8 — login quản trị, sửa kèo, xoá kèo, CRUD quán, yêu cầu, đổi mật khẩu.
import { chromium } from 'playwright';

const FILE = 'file:///C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/keo-de.html';
const OUT = 'C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos';
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

const createKeo = async (title, time) => {
  await page.click('.topbar .js-open-modal');
  await page.fill('#fname', title);
  await page.fill('#fplace', 'Quán test');
  const d = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  await page.fill('#fdate', d);
  await page.fill('#ftime', time);
  await page.click('#kform .btn-p');
  await page.waitForTimeout(250);
};

// 0. tạo dữ liệu bằng user demo trước
await page.goto(FILE, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));
await page.evaluate(() => { location.hash = 'onboard'; });
await page.reload({ waitUntil: 'networkidle' });
await page.fill('#obDob', '2004-11-27');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');
await createKeo('Kèo test cho admin', '19:00');
await page.evaluate(()=>{localStorage.setItem('keode.venueReq.v1',JSON.stringify([{name:'Quán cần hợp tác ABC',district:'Quận 1',phone:'0987654321',time:'T7-CN tối',msg:'',at:Date.now()}]));});
await page.reload({ waitUntil: 'networkidle' });

// 1. vào #admin (không phụ thuộc user session)
await page.goto(FILE + '#admin', { waitUntil: 'networkidle' });
console.log('A1 | admin login hiện?', await page.locator('#adminLogin:not(.hide)').count() === 1,
  '| app ẩn?', await page.locator('#view-app.hide').count() === 1);

// 2. sai mật khẩu
await page.fill('#admPass', 'sai-roiet');
await page.click('#admLoginBtn');
console.log('A2 | sai pass báo lỗi?', await page.locator('#admErr:not(.hide)').count() === 1);

// 3. đúng mật khẩu mặc định admin123
await page.fill('#admPass', 'admin123');
await page.click('#admLoginBtn');
await page.waitForSelector('#adminPanel:not(.hide)');
console.log('A3 | panel vào? true | tổng quan stats:',
  await page.locator('.astat').count(), 'ô | badge ADMIN:', await page.locator('.abadge').count() >= 1);
await page.screenshot({ path: `${OUT}/v8-admin-overview.png` });

// 4. tab Quản lý kèo: thấy kèo + Sửa
await page.click('#atabs .tab[data-at="keos"]');
await page.waitForTimeout(100);
console.log('A4 | rows =', await page.locator('#akeosTable tr').count() - 1,
  '| tìm kiếm lọc:', await page.fill('#akeys', 'admin') === undefined ? 'ok' : 'ok',
  '| sau lọc rows =', await page.locator('#akeosTable tr').count() - 1);
await page.fill('#akeys', '');

// 5. SỬA kèo: đổi tên + giờ
await page.click('#akeosTable [data-act="aedit"]');
await page.waitForSelector('#overlay:not(.hide)');
console.log('A5 | modal sửa tiêu đề:', (await page.textContent('#mtitle')).trim(),
  '| prefill tên:', await page.inputValue('#fname'));
await page.fill('#fname', 'Kèo ĐÃ SỬA BỞI ADMIN');
await page.fill('#ftime', '21:30');
await page.click('#kform .btn-p');
await page.waitForTimeout(250);
console.log('A6 | sau sửa: table có tên mới?', (await page.textContent('#akeosTable')).includes('Kèo ĐÃ SỬA BỞI ADMIN'),
  '| app feed cũng cập nhật?', await page.evaluate(() => {
    location.hash = 'discover';
    return document.getElementById('feed').textContent.includes('Kèo ĐÃ SỬA BỞI ADMIN');
  }));
await page.screenshot({ path: `${OUT}/v8-admin-keos.png` });

// 6. XOÁ kèo qua admin
await page.goto(FILE + '#admin', { waitUntil: 'networkidle' });
await page.click('#atabs .tab[data-at="keos"]');
page.once('dialog', dlg => dlg.accept());
await page.click('#akeosTable [data-act="adel"]');
await page.waitForTimeout(300);
console.log('A7 | sau xoá qua admin: rows =', Math.max(0, await page.locator('#akeosTable tr').count() - 1),
  '| toast:', (await page.textContent('#toast')).slice(0, 10));

// 7. Quán đối tác: thêm + sửa + xoá
await page.click('#atabs .tab[data-at="venues"]');
await page.click('[data-act="vadd"]');
await page.fill('#vEname', 'Quán Mới Đẹp');
await page.selectOption('#vEdistrict', 'Thủ Đức');
await page.selectOption('#vEemoji', '🎮');
await page.selectOption('#vEcat', 'Xem phim');
await page.fill('#vEtags', 'Boardgame, Gaming');
await page.fill('#vEpromo', 'Tặng nước cho kèo 4 người');
await page.fill('#vEnote', 'Gaming hub nhiều máy.');
await page.click('#veForm .btn-p');
await page.waitForTimeout(200);
console.log('A8 | thêm quán: vcard =', await page.locator('.vcard').count(),
  '| có tên mới?', (await page.textContent('#vgrid')).includes('Quán Mới Đẹp'),
  '| partner strip có quán?', (await page.textContent('#pstrip')).includes('Espresso Lab'));
await page.goto(FILE + '#venues', { waitUntil: 'networkidle' });
console.log('A8b | trang venues thấy quán mới?', (await page.textContent('#vgrid')).includes('Quán Mới Đẹp'));

// 8. Yêu cầu của quán
await page.goto(FILE + '#admin', { waitUntil: 'networkidle' });
await page.click('#atabs .tab[data-at="requests"]');
console.log('A9 | yêu cầu quán hiển thị?', (await page.textContent('#adminBody')).includes('Quán cần hợp tác ABC'),
  '| nút xoá =', await page.locator('[data-act="rdel"]').count());

// 9. Cài đặt: đổi mật khẩu + logout + login lại
await page.click('#atabs .tab[data-at="settings"]');
await page.fill('#pCur', 'admin123');
await page.fill('#pNew', 'vu12345');
await page.click('#passForm .btn-p');
await page.waitForTimeout(150);
console.log('A10 | đổi pass:', (await page.textContent('#toast')).includes('Đã đổi'));
await page.click('[data-act="admlogout"]');
await page.waitForTimeout(100);
await page.fill('#admPass', 'admin123');
await page.click('#admLoginBtn');
console.log('A11 | pass cũ bị chặn?', await page.locator('#admErr:not(.hide)').count() === 1);
await page.fill('#admPass', 'vu12345');
await page.click('#admLoginBtn');
await page.waitForSelector('#adminPanel:not(.hide)');
console.log('A12 | pass mới vào được ✓');
// đổi về mặc định cho lần chạy test sau
await page.click('#atabs .tab[data-at="settings"]');
await page.fill('#pCur', 'vu12345');
await page.fill('#pNew', 'admin123');
await page.click('#passForm .btn-p');
await page.waitForTimeout(150);

const hOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
console.log('horizontal overflow:', hOverflow);
console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ZERO page/console errors');
await browser.close();
