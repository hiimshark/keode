// README → v0.6 (Firebase Auth 1-paste).
const fs = require('fs');
let r = fs.readFileSync('README.md', 'utf8');
r = r.replace('# KÈO ĐÊ — prototype · v0.5 (cokeo-style + ĐĂNG NHẬP THẬT Google/Facebook)',
  '# KÈO ĐÊ — prototype · v0.6 (cokeo-style + Firebase Auth: đăng nhập thật, setup 1-paste)');
r = r.replace(/## Đăng nhập thật \(v0\.5\)[\s\S]*?(?=\n## Flow)/,
`## Đăng nhập thật (v0.6 — Firebase Auth)
- Google + Facebook popup qua **Firebase Authentication** (compat SDK từ gstatic).
- Chủ web làm **1 lần duy nhất**: bấm "⚙️ Cấu hình đăng nhập thật" trên màn login → làm theo 4 bước
  (tạo project Firebase → bật Google provider → copy firebaseConfig → paste) → Lưu. Hỗ trợ parse
  nguyên đoạn firebaseConfig, không cần tách trường. Có nút tải \`auth-config.js\` để đặt cạnh
  keo-de.html khi deploy — từ đó **người dùng cuối không thấy màn cấu hình**, chỉ bấm nút và chọn tài khoản.
- Config Firebase không phải mật khẩu (public-safe theo thiết kế của Google).
- Mở web bằng \`http://localhost:8787\` (domain localhost đã được Firebase cho phép sẵn).
- "Chưa có ID? Xem thử demo →" là lối vào không cần config (session provider=demo).
- Production cần backend verify token; Firebase cũng là nền tảng để thêm Firestore (kèo sync đa người dùng) sau này.

## Flow
1. **Đăng nhập** (Google/Facebook thật qua Firebase; hoặc demo)`);
r = r.replace('prototype v0.5 · chỉ TP. Hồ Chí Minh', 'prototype v0.6 · chỉ TP. Hồ Chí Minh');
r = r.replace('- `keode.oauth.v1` Client ID/App ID', '- `keode.firebase.v1` firebaseConfig');
fs.writeFileSync('README.md', r);
console.log('README → v0.6 OK');
