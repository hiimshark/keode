// Sửa test-keode: thay khối step 1-2 bằng phiên bản hợp thế giới mới (dùng slicing, không lo anchor).
const fs = require('fs');
let t = fs.readFileSync('scripts/test-keode.mjs', 'utf8');
const START = '// 1. login + phone UI + cấu hình Firebase paste';
const END = '// 2. demo → onboarding → app';
const s = t.indexOf(START), e = t.indexOf(END);
if (s < 0 || e < 0) { console.log('anchors not found'); process.exit(1); }
const fresh = `// 1. login sạch: config ships sẵn, OTP đã xoá
await page.goto(FILE, { waitUntil: 'networkidle' });
console.log('login hiện?', await page.locator('#view-login:not(.hide)').count() === 1,
  '| Google nút thật hiện?', await page.locator('#gsiBtn:not(.hide)').count() === 1,
  '| cfgBar ẩn cho khách?', await page.evaluate(() => getComputedStyle(document.getElementById('cfgBar')).display === 'none'),
  '| OTP đã xoá?', await page.locator('#phNum').count() === 0,
  '| config nạp?', await page.evaluate(() => !!(window.KEO_FIREBASE_CONFIG && window.KEO_FIREBASE_CONFIG.apiKey)));

`;
t = t.slice(0, s) + fresh + t.slice(e);
// step 2 giữ nguyên (demoLink đã bị xoá trong app → seed session thay thế)
t = t.replace(`// 2. demo → onboarding → app
await page.click('#demoLink');`,
`// 2. vào onboarding (seed session demo)
await page.evaluate(() => localStorage.setItem('keode.session.v1', JSON.stringify({provider:'demo',id:'demo',name:'Lê Hoàng Vũ',email:'',picture:''})));
await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });`);
fs.writeFileSync('scripts/test-keode.mjs', t);
console.log('test-keode step1-2 rebuilt');
