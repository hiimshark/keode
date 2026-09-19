// Cập nhật 4 test suite cho thế giới mới: config ships sẵn, demoLink ẩn, OTP đã xoá.
const fs = require('fs');
const SEED = `await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));`;

/* test-keode.mjs */
let t = fs.readFileSync('scripts/test-keode.mjs', 'utf8');
t = t.replace(`console.log('login hiện?', await page.locator('#view-login:not(.hide)').count() === 1,
  '| nút Google mock =', await page.locator('#gMock:not(.hide)').count(),
  '| Google nút thật ẩn (chưa cấu hình)?', await page.locator('#gsiBtn.hide').count() === 1);
await page.click('#cfgToggle');
await page.fill('#cfgPaste', 'const firebaseConfig = { apiKey: "AIzaFake", authDomain: "keode.firebaseapp.com", projectId: "keode", appId: "1:123:web:abc" };');
await page.click('#cfgSave');
console.log('firebase config:', (await page.textContent('#cfgStatus')).includes('Đăng nhập Google/Facebook thật đã bật'));

// 2. demo bypass → onboarding
await page.click('#demoLink');`,
`console.log('login hiện?', await page.locator('#view-login:not(.hide)').count() === 1,
  '| Google nút thật hiện (config ships)?', await page.locator('#gsiBtn:not(.hide)').count() === 1,
  '| cfgBar ẩn cho khách?', await page.evaluate(() => getComputedStyle(document.getElementById('cfgBar')).display === 'none'));
console.log('firebase config nạp:', await page.evaluate(() => !!(window.KEO_FIREBASE_CONFIG && window.KEO_FIREBASE_CONFIG.apiKey)),
  '| OTP đã xoá?', await page.locator('#phNum').count() === 0);

// 2. vào onboarding (session demo qua localStorage)
` + SEED + `
await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });`);
t = t.replace(`await page.click('#demoLink');
await page.fill('#obDob', '2004-11-27');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');
console.log('login lại | cards =',`,
`await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });
await page.fill('#obDob', '2004-11-27');
await page.click('#obNext');
await page.click('#obDistricts .pchip:nth-child(1)');
await page.click('#obLikes .pchip:nth-child(1)');
await page.click('#obDone');
await page.waitForSelector('#view-app:not(.hide)');
console.log('login lại | cards =',`);
fs.writeFileSync('scripts/test-keode.mjs', t);

/* test-nav.mjs */
t = fs.readFileSync('scripts/test-nav.mjs', 'utf8');
t = t.replace(`  await page.goto(FILE, { waitUntil: 'networkidle' });
  await page.click('#demoLink');`,
`  await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));
  await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });`);
fs.writeFileSync('scripts/test-nav.mjs', t);

/* test-admin.mjs */
t = fs.readFileSync('scripts/test-admin.mjs', 'utf8');
t = t.replace(`await page.goto(FILE, { waitUntil: 'networkidle' });
await page.click('#demoLink');`,
`await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));
await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });`);
fs.writeFileSync('scripts/test-admin.mjs', t);

/* test-kyc.mjs */
t = fs.readFileSync('scripts/test-kyc.mjs', 'utf8');
t = t.replace(`console.log('login | phone UI =', await page.locator('#phNum').count());
await page.click('#cfgToggle');
await page.fill('#cfgPaste', 'const firebaseConfig = { apiKey: "AIzaFake", authDomain: "keode.firebaseapp.com", projectId: "keode", appId: "1:123:web:abc" };');
await page.click('#cfgSave');
console.log('firebase config:', (await page.textContent('#cfgStatus')).includes('Đăng nhập Google/Facebook thật đã bật'));

// 2. demo → onboarding
await page.click('#demoLink');`,
`console.log('login | OTP đã xoá?', await page.locator('#phNum').count() === 0,
  '| config nạp?', await page.evaluate(() => !!(window.KEO_FIREBASE_CONFIG && window.KEO_FIREBASE_CONFIG.apiKey)));

// 2. vào onboarding (session demo)
` + SEED + `
await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });`);
fs.writeFileSync('scripts/test-kyc.mjs', t);

console.log('all 4 tests updated');
