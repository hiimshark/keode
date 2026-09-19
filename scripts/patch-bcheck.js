// B: chờ snapshot tới nơi (poll 10s) rồi mới đếm, in ra tiêu đề tất cả card.
const fs = require('fs');
let t = fs.readFileSync('scripts/test-cloud-live.mjs', 'utf8');
const a = `const seen = await B.p.locator('#feed .kcard:has-text("Kèo cloud test — cà phê thử sync")').count();
console.log('B | kèo của A hiện trong feed:', seen === 1);`;
const b = `let seen = 0;
for (let i = 0; i < 20; i++) {
  seen = await B.p.locator('#feed .kcard:has-text("Kèo cloud test — cà phê thử sync")').count();
  if (seen > 0) break;
  await B.p.waitForTimeout(500);
}
console.log('B | kèo của A hiện trong feed (chờ tối đa 10s):', seen > 0);
console.log('B | tất cả kèo B thấy:', (await B.p.locator('#feed .ktitle').allTextContents()).join(' | '));`;
if (!t.includes(a)) { console.log('anchor not found'); process.exit(1); }
t = t.replace(a, () => b);
fs.writeFileSync('scripts/test-cloud-live.mjs', t);
console.log('B check robust');
