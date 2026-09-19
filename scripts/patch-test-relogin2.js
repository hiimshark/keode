// Cách 2: tách file tại dòng 'logout | login hiện?' rồi thay block trong phần đuôi.
const fs = require('fs');
let t = fs.readFileSync('scripts/test-keode.mjs', 'utf8');
const marker = "console.log('logout | login hiện?'";
const idx = t.indexOf(marker);
if (idx < 0) { console.log('marker not found'); process.exit(1); }
const head = t.slice(0, idx);
let tail = t.slice(idx);

const oldChunk = `await page.fill('#obDob', '2004-11-27');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');`;
if (!tail.includes(oldChunk)) { console.log('old onboarding chunk not found in tail'); process.exit(1); }
tail = tail.replace(oldChunk, `console.log('login lại | vào thẳng app (không onboarding)?', await page.locator('#view-app:not(.hide)').count() === 1,
  '| onboarding ẩn?', await page.locator('#view-onboard.hide').count() === 1);`);
tail = tail.replace("location.hash = 'onboard';", "location.hash = 'discover';");

fs.writeFileSync('scripts/test-keode.mjs', head + tail);
console.log('relogin block OK');
