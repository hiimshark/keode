// README → v0.9: tài khoản email + KYC CCCD.
const fs = require('fs');
let r = fs.readFileSync('README.md', 'utf8');
r = r.replace('# KÈO ĐÊ — prototype · v0.8 (cokeo-style · Đăng nhập thật · Cloud · OTP · Policy · ADMIN PANEL)',
  '# KÈO ĐÊ — prototype · v0.9 (cokeo-style · Tài khoản email · Xác minh CCCD · ADMIN PANEL · Cloud · OTP)');
r = r.replace('prototype v0.8 · chỉ TP. Hồ Chí Minh', 'prototype v0.9 · chỉ TP. Hồ Chí Minh');
r += `
## TÀI KHOẢN EMAIL + XÁC MINH CCCD (v0.9)
- Màn login có khung "Tạo tài khoản / đăng nhập bằng email" — Firebase khi có config, không có thì dùng tài khoản local demo (hash mật khẩu, lưu máy).
- **Xác minh danh tính (KYC)**: user upload mặt trước CCCD + selfie → trạng thái "chờ duyệt" → admin duyệt ở tab "Xác minh CCCD" (xem 2 ảnh) → gắn thẻ ✓ Đã xác minh. Chưa XM vẫn dùng web bình thường nhưng có tag "⚠ Chưa XM" trên kèo + banner nhắc.
- **Chính sách CCCD (chặt)**: chỉ admin xem; ảnh XOÁ VĨNH VIỄN trong 7 ngày sau quyết định; không chia sẻ; có thể huỷ yêu cầu bất cứ lúc nào. Nằm trong trang Policy (tab Quyền riêng tư, mục 9).
- Lưu ý bảo mật: bản mẫu lưu ảnh base64 trong localStorage/Firestore kyc — production bắt buộc Firebase Storage + rules + xoá tự động; admin phải là custom claim.
- Tests: \`node scripts/test-kyc.mjs\` (đăng ký → KYC → admin duyệt → badge → policy) — PASS zero errors. Cần 2 file ảnh fixture \`assets/_test-*.png\` (test tự tạo).
`;
fs.writeFileSync('README.md', r);
console.log('README → v0.9 OK');
