// Cập nhật test relogin: đăng nhập lại → vào thẳng app (không onboarding).
const fs = require('fs');
let t = fs.readFileSync('scripts/test-keode.mjs', 'utf8');
const lines = t.split('\n');
const iSet = lines.findIndex(l => l.includes("localStorage.setItem('keode.session.v1'") && l.includes("provider:'demo'") && lines.findIndex(x => x.includes('logout | login')) > -1 && lines.indexOf(l) > lines.findIndex(x => x.includes('logout | login')));
if (iSet < 0) { console.log('seed line not found after logout'); process.exit(1); }
// tìm dòng 'login lại | cards' sau đó
const iLog = lines.findIndex((l, idx) => idx > iSet && l.includes("login lại | cards ="));
if (iLog < 0) { console.log('login-lại log not found'); process.exit(1); }
const before = lines.slice(0, iSet);
const after = lines.slice(iLog);
const newBlock = [
  "await page.evaluate(() => { location.hash = 'discover'; });",
  "await page.reload({ waitUntil: 'networkidle' });",
  "console.log('login lại | vào thẳng app (không onboarding)?', await page.locator('#view-app:not(.hide)').count() === 1,",
  "  '| onboarding ẩn?', await page.locator('#view-onboard.hide').count() === 1);",
];
t = [...before, ...newBlock, ...after].join('\n');
fs.writeFileSync('scripts/test-keode.mjs', t);
console.log('relogin block rewritten (giữ seed, bỏ onboarding fill)');
