// Fix test-cloud-live: dùng biến uid thay $uid, khai báo const uid.
const fs = require('fs');
let t = fs.readFileSync('scripts/test-cloud-live.mjs', 'utf8');
if (!t.includes('const uid = Date.now();')) {
  t = t.replace('const errors = [];', 'const errors = [];\nconst uid = Date.now();');
}
t = t.split("$uid+'@keo.vn'").join("uid+'@keo.vn'");
fs.writeFileSync('scripts/test-cloud-live.mjs', t);
console.log('uid fixed');
