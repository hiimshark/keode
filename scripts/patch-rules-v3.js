// Rules v3: total đọc từ resource.data (không phải request.resource.data) — sửa lỗi join bị chặn.
const fs = require('fs');
let r = fs.readFileSync('firestore.rules', 'utf8');
const a = `          && request.resource.data.members.size() <= request.resource.data.total)`;
const b = `          && request.resource.data.members.size() <= resource.data.total)`;
if (!r.includes(a)) { console.log('anchor not found'); process.exit(1); }
r = r.replace(a, () => b);
r = r.replace('rules v2 (sửa lỗi join + hỗ trợ admin)', 'rules v3 (fix join: total đọc từ resource.data)');
fs.writeFileSync('firestore.rules', r);
console.log('rules v3 OK');
