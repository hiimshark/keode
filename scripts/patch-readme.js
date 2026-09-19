// Cập nhật README lên v0.5 (đăng nhập thật).
const fs = require('fs');
let r = fs.readFileSync('README.md', 'utf8');
r = r.replace('# KÈO ĐÊ — prototype "rủ rê tìm kèo" · Sài Gòn edition (v0.4 — cokeo-style, không pixel)',
  '# KÈO ĐÊ — prototype · v0.5 (cokeo-style + ĐĂNG NHẬP THẬT Google/Facebook)');
r = r.replace('## Flow\n1. **Đăng nhập** (Google/Facebook — mock, bấm là vào)',
`## Đăng nhập thật (v0.5)
- Google: **Google Identity Services** — nút chính thức của Google, popup chọn tài khoản thật → decode ID token lấy tên/email/ảnh.
- Facebook: **Facebook JS SDK** → FB.login (public_profile,email) → Graph API /me lấy tên/email/ảnh.
- Lần đầu: bấm "⚙️ Cấu hình đăng nhập thật" trên màn login, dán **Google Client ID** + **Facebook App ID** của bạn (hướng dẫn từng bước ngay trong khung). ID lưu localStorage.
- Lưu ý: Client ID/App ID chỉ bạn tạo được (tài khoản Google/FB dev của bạn). Chế độ Testing chỉ cho phép tài khoản của bạn đăng nhập — muốn public phải verify app. Prototype chưa có backend nên token chưa được verify phía server (production bắt buộc phải verify).
- "Chưa có ID? Xem thử demo →" là lối vào không cần ID (session provider=demo, đánh dấu rõ).

## Flow
1. **Đăng nhập** (thật khi đã cấu hình ID; hoặc demo)`);
r = r.replace('- `keode.profile.v1` hồ sơ · `keode.posts.v2` kèo (do user tạo, HTML-escape)\n  · `keode.venueReq.v1` yêu cầu của quán',
  '- `keode.profile.v1` hồ sơ (kèm email/ảnh từ Google/FB) · `keode.posts.v2` kèo · `keode.venueReq.v1` yêu cầu quán · `keode.oauth.v1` Client ID/App ID · `keode.session.v1` phiên đăng nhập (có Đăng xuất)');
r = r.replace('prototype v0.4 · chỉ TP. Hồ Chí Minh', 'prototype v0.5 · chỉ TP. Hồ Chí Minh');
fs.writeFileSync('README.md', r);
console.log('README → v0.5 OK');
