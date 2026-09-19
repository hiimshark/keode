# KÈO ĐÊ — LIVE: https://keode.netlify.app

# KÈO ĐÊ — prototype · v0.9 (cokeo-style · Tài khoản email · Xác minh CCCD · ADMIN PANEL · Cloud · OTP)

Giao diện hiện đại theo cokeo.vn (user chọn): nền sáng, card trắng bo tròn, accent xanh #2E5BE8, avatar tròn, icon emoji pastel, font Baloo 2 + Be Vietnam Pro. Bản đồ SVG biên giới TP.HCM thật (ADM1).
chia theo quận, có hệ thống **quán đối tác (booking / đề xuất)**. Danh tính chủ tài khoản: **Lê Hoàng Vũ**.

## Chạy local
```
node scripts/serve.js          # → http://127.0.0.1:8787/
```
Mở **http://127.0.0.1:8787/** (tự vào `keo-de.html`). Cần internet để load font.

## Đăng nhập thật (v0.6 — Firebase Auth)
- Google + Facebook popup qua **Firebase Authentication** (compat SDK từ gstatic).
- Chủ web làm **1 lần duy nhất**: bấm "⚙️ Cấu hình đăng nhập thật" trên màn login → làm theo 4 bước
  (tạo project Firebase → bật Google provider → copy firebaseConfig → paste) → Lưu. Hỗ trợ parse
  nguyên đoạn firebaseConfig, không cần tách trường. Có nút tải `auth-config.js` để đặt cạnh
  keo-de.html khi deploy — từ đó **người dùng cuối không thấy màn cấu hình**, chỉ bấm nút và chọn tài khoản.
- Config Firebase không phải mật khẩu (public-safe theo thiết kế của Google).
- Mở web bằng `http://localhost:8787` (domain localhost đã được Firebase cho phép sẵn).
- "Chưa có ID? Xem thử demo →" là lối vào không cần config (session provider=demo).
- Production cần backend verify token; Firebase cũng là nền tảng để thêm Firestore (kèo sync đa người dùng) sau này.


## DEPLOY — đưa web lên internet (3 cách, đều miễn phí)
Sau khi tạo Firebase project và lưu cấu hình (xem phần Đăng nhập thật):
1. **Netlify Drop (dễ nhất, không cần cài gì):** tải file auth-config.js từ màn cấu hình → đặt cạnh keo-de.html → kéo-thả CẢ THƯ MỤC vào https://app.netlify.com/drop → nhận link live ngay.
2. **Vercel/Netlify CLI:** `npx vercel` hoặc `npx netlify deploy --prod` trong thư mục này.
3. Sau khi có domain: Firebase Console → Authentication → Settings → **Authorized domains** → Add domain (thêm domain của Netlify/Vercel).
Đã kèm: `netlify.toml` (headers bảo mật) · `firestore.rules` (quy tắc bảo mật DB) · `auth-config.example.js`.

## CLOUD (Firestore — v0.7)
- Bật: Firebase Console → Build → **Firestore Database** → Create database (Start in test mode) → dán nội dung `firestore.rules` vào tab Rules → Publish.
- Khi đăng nhập bằng Google/Facebook (không phải demo): app tự chuyển **cloud mode** — badge "☁️ Cloud — mọi người cùng thấy kèo", kèo sync real-time giữa mọi người, tham gia/huỷ ghi lên cloud.
- Demo mode vẫn hoạt động offline (badge 💾).
- Phone OTP: bật **Phone provider** trong Authentication (SMS thật cần bật billing; số test miễn phí — thêm trong Phone → Phone numbers for testing).

## MỚI Ở v0.7
- **Xoá kèo**: chủ kèo xoá kèo của mình; admin (Lê Hoàng Vũ) xoá được mọi kèo (nút trong trang chi tiết).
- **Kèo tự ẩn**: lúc tạo kèo chọn "Kèo tự biến mất sau" (kết thúc +12h/+1 ngày/+3 ngày/không). Hết hạn tự ẩn khỏi bảng tin, chủ kèo vẫn thấy trong "Kèo của tôi" kèm chip "Đã ẩn".
- **Cảnh báo kèo đi khuya**: kèo từ 22h trở đi tự gắn chip đỏ "🌙 Kèo khuya" + khung cảnh bảo ở trang chi tiết (bảo vệ các bạn nữ).
- **Quán liên kết**: badge "✓ Quán đã qua xác minh của chủ hệ thống" trên từng quán + kênh liên hệ trực tiếp: Facebook SharkHunter01 / Zalo 0328206839.
- **Policy**: trang Điều khoản · Quyền riêng tư (theo NĐ 13/2023/NĐ-CP) · An toàn cộng đồng — xem được khi chưa đăng nhập (#policy).
- **Bảo mật**: CSP headers (netlify.toml + meta), esc mọi nội dung user, Firestore rules (bắt buộc đăng nhập để ghi, chỉ chủ kèo xoá), đăng nhập qua Google/FB không qua mật khẩu.

## Flow
1. **Đăng nhập** Google/Facebook/OTP thật (qua Firebase) hoặc demo
2. Onboarding → **Khám phá** (hero, tìm kiếm + quận, danh mục, quán đối tác, feed + radar SVG Sài Gòn)
3. **Chi tiết kèo**: tham gia, chia sẻ, xoá (nếu là chủ/admin), cảnh báo an toàn/kèo khuya
4. **Kèo của tôi** · **Quán liên kết** (xác minh + form liên hệ) · **Tin nhắn** (stub) · **#policy**
## ADMIN PANEL (v0.8)
- Vào: link "Quản trị" ở footer/màn login, hoặc mở trực tiếp #admin
- Mật khẩu mặc định: admin123 → ĐỔI NGAY trong tab Cài đặt (lưu hash trên máy)
- Chức năng: Tổng quan (stats) · Quản lý kèo (tìm kiếm, SỬA đầy đủ, XOÁ mọi kèo) · Quán đối tác (thêm/sửa/xoá — lưu localStorage) · Yêu cầu của quán (xem/xoá) · Cài đặt (đổi mật khẩu, đăng xuất quản trị)
- Bảo mật: mật khẩu lưu dạng hash (demo-grade); production cần Firebase custom claim admin + Firestore rules đã có sẵn request.auth.token.admin

## TÀI KHOẢN EMAIL + XÁC MINH CCCD (v0.9)
- Màn login có khung "Tạo tài khoản / đăng nhập bằng email" — Firebase khi có config, không có thì dùng tài khoản local demo (hash mật khẩu, lưu máy).
- **Xác minh danh tính (KYC)**: user upload mặt trước CCCD + selfie → trạng thái "chờ duyệt" → admin duyệt ở tab "Xác minh CCCD" (xem 2 ảnh) → gắn thẻ ✓ Đã xác minh. Chưa XM vẫn dùng web bình thường nhưng có tag "⚠ Chưa XM" trên kèo + banner nhắc.
- **Chính sách CCCD (chặt)**: chỉ admin xem; ảnh XOÁ VĨNH VIỄN trong 7 ngày sau quyết định; không chia sẻ; có thể huỷ yêu cầu bất cứ lúc nào. Nằm trong trang Policy (tab Quyền riêng tư, mục 9).
- Lưu ý bảo mật: bản mẫu lưu ảnh base64 trong localStorage/Firestore kyc — production bắt buộc Firebase Storage + rules + xoá tự động; admin phải là custom claim.
- Tests: `node scripts/test-kyc.mjs` (đăng ký → KYC → admin duyệt → badge → policy) — PASS zero errors. Cần 2 file ảnh fixture `assets/_test-*.png` (test tự tạo).
