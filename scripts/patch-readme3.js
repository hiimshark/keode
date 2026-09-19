// README → v0.7: cloud + OTP + policy + xoá kèo/tự ẩn/kèo khuya + DEPLOY GUIDE.
const fs = require('fs');
let r = fs.readFileSync('README.md', 'utf8');
r = r.replace('# KÈO ĐÊ — prototype · v0.6 (cokeo-style + Firebase Auth: đăng nhập thật, setup 1-paste)',
  '# KÈO ĐÊ — prototype · v0.7 (cokeo-style · Đăng nhập thật · Cloud · OTP · Policy)');

const deploy = `
## DEPLOY — đưa web lên internet (3 cách, đều miễn phí)
Sau khi tạo Firebase project và lưu cấu hình (xem phần Đăng nhập thật):
1. **Netlify Drop (dễ nhất, không cần cài gì):** tải file auth-config.js từ màn cấu hình → đặt cạnh keo-de.html → kéo-thả CẢ THƯ MỤC vào https://app.netlify.com/drop → nhận link live ngay.
2. **Vercel/Netlify CLI:** \`npx vercel\` hoặc \`npx netlify deploy --prod\` trong thư mục này.
3. Sau khi có domain: Firebase Console → Authentication → Settings → **Authorized domains** → Add domain (thêm domain của Netlify/Vercel).
Đã kèm: \`netlify.toml\` (headers bảo mật) · \`firestore.rules\` (quy tắc bảo mật DB) · \`auth-config.example.js\`.

## CLOUD (Firestore — v0.7)
- Bật: Firebase Console → Build → **Firestore Database** → Create database (Start in test mode) → dán nội dung \`firestore.rules\` vào tab Rules → Publish.
- Khi đăng nhập bằng Google/Facebook (không phải demo): app tự chuyển **cloud mode** — badge "☁️ Cloud — mọi người cùng thấy kèo", kèo sync real-time giữa mọi người, tham gia/huỷ ghi lên cloud.
- Demo mode vẫn hoạt động offline (badge 💾).
- Phone OTP: bật **Phone provider** trong Authentication (SMS thật cần bật billing; số test miễn phí — thêm trong Phone → Phone numbers for testing).

## MỚI Ở v0.7
- **Xoá kèo**: chủ kèo xoá kèo của mình; admin (Lê Hoàng Vũ) xoá được mọi kèo (nút trong trang chi tiết).
- **Kèo tự ẩn**: lúc tạo kèo chọn "Kèo tự biến mất sau" (kết thúc +12h/+1 ngày/+3 ngày/không). Hết hạn tự ẩn khỏi bảng tin, chủ kèo vẫn thấy trong "Kèo của tôi" kèm chip "Đã ẩn".
- **Cảnh báo kèo đi khuya**: kèo từ 22h trở đi tự gắn chip đỏ "🌙 Kèo khuya" + khung cảnh bảo ở trang chi tiết (bảo vệ các bạn nữ).
- **Quán liên kết**: badge "✓ Quán đã qua xác minh của chủ hệ thống" trên từng quán + kênh liên hệ trực tiếp: Facebook SharkHunter01 / Zalo 0328206839.
- **Policy**: trang Điều khoản · Quyền riêng tư (theo NĐ 13/2023/NĐ-CP) · An toàn cộng đồng — xem được khi chưa đăng nhập (#policy).
- **Bảo mật**: CSP headers (netlify.toml + meta), esc mọi nội dung user, Firestore rules (bắt buộc đăng nhập để ghi, chỉ chủ kèo xoá), đăng nhập qua Google/FB không qua mật khẩu.`;

r = r.replace(/## Flow[\s\S]*$/, deploy + `\n\n## Flow\n1. **Đăng nhập** Google/Facebook/OTP thật (qua Firebase) hoặc demo\n2. Onboarding → **Khám phá** (hero, tìm kiếm + quận, danh mục, quán đối tác, feed + radar SVG Sài Gòn)\n3. **Chi tiết kèo**: tham gia, chia sẻ, xoá (nếu là chủ/admin), cảnh báo an toàn/kèo khuya\n4. **Kèo của tôi** · **Quán liên kết** (xác minh + form liên hệ) · **Tin nhắn** (stub) · **#policy**`);
fs.writeFileSync('README.md', r);
console.log('README → v0.7 OK');
