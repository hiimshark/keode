// Fix: dòng vibes mất một ký tự $ (phải là $$) + cập nhật test policy.
const fs = require('fs');

// 1. keo-de.html: $$ cho NodeList
let h = fs.readFileSync('keo-de.html', 'utf8');
const broken = "  const vibes=$('#vibeChips input:checked').map(i=>i.value);";
const fixed = "  const vibes=$$('#vibeChips input:checked').map(i=>i.value);";
if (h.includes(broken)) { h = h.replace(broken, fixed); console.log('vibes $$ fixed'); }
else if (h.includes(fixed)) { console.log('vibes $$ already ok'); }
else { console.log('VIBES LINE NOT FOUND'); process.exit(1); }
fs.writeFileSync('keo-de.html', h);

// 2. test: policy assertions đúng thứ tự tab
let t = fs.readFileSync('scripts/test-keode.mjs', 'utf8');
const a1 = "| NĐ 13/2023?', (await page.textContent('#policyBody')).includes('Nghị định 13/2023'));";
const b1 = "| điều khoản?', (await page.textContent('#policyBody')).includes('Quy tắc đăng kèo'));";
if (t.includes(a1)) { t = t.replace(a1, b1); console.log('test step0 updated'); }
const a2 = `await page.click('.ptab[data-pt="safety"]');`;
const b2 = `await page.click('.ptab[data-pt="privacy"]');
console.log('tab quyền riêng tư (NĐ 13/2023):', (await page.textContent('#policyBody')).includes('Nghị định 13/2023'));
await page.click('.ptab[data-pt="safety"]');`;
if (t.includes(a2)) { t = t.replace(a2, b2); console.log('test privacy step added'); }
fs.writeFileSync('scripts/test-keode.mjs', t);
console.log('done');
