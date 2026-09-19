// Vào onboarding chắc chắn: seed → đặt hash → reload (đọc lại session từ localStorage).
const fs = require('fs');
const OLD = `await page.goto(FILE + '#onboard', { waitUntil: 'networkidle' });`;
const NEW = `await page.evaluate(() => { location.hash = 'onboard'; });
await page.reload({ waitUntil: 'networkidle' });`;

for (const f of ['scripts/test-keode.mjs', 'scripts/test-nav.mjs', 'scripts/test-admin.mjs', 'scripts/test-kyc.mjs']) {
  let t = fs.readFileSync(f, 'utf8');
  const n = t.split(OLD).length - 1;
  if (n) { t = t.split(OLD).join(NEW); fs.writeFileSync(f, t); }
  console.log(f, '→ thay', n, 'chỗ');
}
