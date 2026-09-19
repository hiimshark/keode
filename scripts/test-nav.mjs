// Test điều hướng v0.7.1 — đúng 2 bug user báo:
// A) từ "Kèo của tôi" mở chi tiết → ← phải quay ra được
// B) xoá kèo xong → về trang chủ không cần reload
import { chromium } from 'playwright';

const FILE = 'file:///C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/keo-de.html';
const errors = [];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on('pageerror', e => errors.push('pageerror: ' + e.message));
page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

const gotoApp = async () => {
  await page.goto(FILE, { waitUntil: 'networkidle' });
  await page.click('#demoLink');
  await page.fill('#obDob', '2004-11-27');
  await page.click('#obNext');
  await page.click('#obDistricts .pchip:nth-child(1)');
  await page.click('#obLikes .pchip:nth-child(1)');
  await page.click('#obDone');
  await page.waitForSelector('#view-app:not(.hide)');
};
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

// A. TẠO KÈO → VÀO "KÈO CỦA TÔI" → MỞ CHI TIẾT → ← QUAY LẠI
await gotoApp();
await createKeo('Kèo test điều hướng A', '19:00');
console.log('A0 | hash sau tạo:', await page.evaluate(() => location.hash),
  '| cards =', await page.locator('#feed .kcard').count());
await page.click('.tab[data-route="mine"]');
await page.click('#mineHost .kcard .kbtns [data-act="view"]');
await page.waitForSelector('#page-detail.on');
console.log('A1 | vào chi tiết từ mine | nút ← ghi:', (await page.textContent('#backBtn')).trim(),
  '| hash:', await page.evaluate(() => location.hash));
await page.click('#backBtn');
await page.waitForTimeout(150);
console.log('A2 | bấm ← → về đúng "Kèo của tôi"?',
  await page.locator('#page-mine.on').count() === 1,
  '| không reload (bảng tin còn kèo)?', await page.locator('#feed .kcard').count() === 1);

// B. TỪ KHÁM PHÁ: MỞ CHI TIẾT → XOÁ KÈO → VỀ TRANG CHỦ KHÔNG CẦN RELOAD
await page.click('.tab[data-route="discover"]');
await page.click('#feed .kcard .kbtns [data-act="view"]');
await page.waitForSelector('#page-detail.on');
page.once('dialog', dlg => dlg.accept());
await page.click('#delBtn');
await page.waitForTimeout(300);
console.log('B1 | xoá xong → về trang chủ không reload?',
  await page.locator('#page-discover.on').count() === 1,
  '| hash:', await page.evaluate(() => location.hash),
  '| feed rỗng?', await page.locator('#feed .kcard').count() === 0);

// C. TỪ KHÁM PHÁ: MỞ CHI TIẾT → ← VỀ KHÁM PHÁ
await createKeo('Kèo test điều hướng C', '19:00');
await page.click('#feed .kcard .kbtns [data-act="view"]');
await page.waitForSelector('#page-detail.on');
await page.click('#backBtn');
await page.waitForTimeout(150);
console.log('C1 | ← từ discover → discover?',
  await page.locator('#page-discover.on').count() === 1,
  '| kèo còn =', await page.locator('#feed .kcard').count());

// D. logo 🍻 quay về trang chủ từ mọi nơi
await page.click('.tab[data-route="venues"]');
await page.click('#homeBtn');
await page.waitForTimeout(150);
console.log('D1 | logo → về Khám phá?', await page.locator('#page-discover.on').count() === 1);

console.log(errors.length ? 'ERRORS:\n' + errors.join('\n') : 'ZERO page/console errors');
await browser.close();
