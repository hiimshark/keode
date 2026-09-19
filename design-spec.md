# design-spec.md — "KÈO ĐÊ" web prototype (pixel style) · input chung cho 3 hướng

> 3 hướng A/B/C chỉ KHÁC NHAU ở phần "Design direction" nhận riêng. Mọi nội dung, cấu trúc màn hình, tương tác, ràng buộc kỹ thuật bên dưới là BẮT BUỘC DÙNG CHUNG để 3 bản có thể so sánh trực diện.

## 1. Sản phẩm & bối cảnh
- **KÈO ĐÊ** (tên giả định) — nền tảng rủ rê tìm "kèo" (meetup buddy) tại Việt Nam: đi cà phê, ăn uống, du lịch, xem phim, nhậu, đá banh…
- Người dùng 18–30, thành thị, quen ngôn ngữ meme/slang Việt ("kèo", "rủ rê", "gòy", "chill").
- Mood nền sản phẩm: vui, đời, an toàn, cộng đồng. KHÔNG phải hẹn hò (dating) — là rủ nhóm/rủ bạn mới theo sở thích.

## 2. Cấu trúc bắt buộc (2 màn hình, 1 file HTML)
### Màn LOGIN (mặc định khi mở file)
1. Khối logo wordmark `KÈO ĐÊ!` + tagline "Rủ nhau đi kèo — kèo nào cũng có người đi cùng." + dòng sub: "Cà phê · Ăn uống · Du lịch · Xem phim · Nhậu · Đá banh"
2. Label "Đăng nhập để rủ kèo"
3. 2 nút đăng nhập CÓ LOGO CHÍNH THỨC inline SVG: "Tiếp tục với Google" (google-g.svg) và "Tiếp tục với Facebook" (facebook-icon.svg)
4. small print: "Bằng việc tiếp tục, bạn đồng ý Điều khoản & Quyền riêng tư của KÈO ĐÊ."
5. Điểm xã hội (dữ liệu mẫu, ghi chú "số liệu mẫu"): "12.483 kèo đã tạo · 3.272 người đang rủ"
- Cả 2 nút → chuyển sang màn APP (mô phỏng OAuth thành công).

### Màn APP (mở nhanh bằng URL hash `#main`)
1. **Topbar:** logo nhỏ · chip user: avatar pixel + "Minh" (@minhngoo) + "TP. Hồ Chí Minh" · nút "＋ TẠO KÈO"
2. **Chips lọc danh mục:** Tất cả / Cà phê / Ăn uống / Du lịch / Xem phim / Nhậu / Đá banh — click lọc feed THẬT (JS)
3. **Feed 8 bài "kèo"** (nội dung CHÍNH XÁC bên dưới, không lorem): mỗi bài có icon pixel của category, title, địa điểm + thành phố, thời gian, host (avatar pixel + tên), thanh slot người (vd 2/4), nút "Rủ thôi!" → click tăng count + đổi thành "Đã rủ ✓" (mỗi bài 1 lần)
4. **Bản đồ Việt Nam pixel** (dùng dữ liệu `assets/vnmap.json`) với 4 pin: Hà Nội (2 kèo), TP. Hồ Chí Minh (4), Đà Nẵng (1), Nha Trang (1) — click/hover pin → popup liệt kê title các kèo ở thành phố đó
5. **Modal "TẠO KÈO"** (nút Tạo kèo mở; nút đóng + Escape đóng): fields = Loại kèo (chọn 1 trong 6) / Tên kèo / Địa điểm / Thành phố (select 9 thành phố) / Ngày + Giờ / Cần bao nhiêu người (2–20) / Mô tả ngắn. Submit → toast "Đăng kèo thành công! Kèo của bạn đang chờ người rủ." (mock, chưa thêm vào feed — được phép thêm nếu muốn)
6. **Footer:** "KÈO ĐÊ — bản mẫu thiết kế (prototype v0.1) · Map data © geoBoundaries (CC BY 4.0)"

## 3. Nội dung CHUNG CHÍNH XÁC (cả 3 bản giống hệt)
### User hiện tại
Minh · @minhngoo · TP. Hồ Chí Minh

### 8 bài kèo (category | title | place | city | time | host | slots)
1. Cà phê | "Cà phê chiều T7, ngồi làm cùng nhau" | Cộng Cà Phê Nguyễn Du | Hà Nội | T7 19/09 · 15:00 | Linh | 2/4
2. Đá banh | "Giao lưu đá 5 người, thiếu 4 cánh tay" | Sân cỏ Nhị Trì | Hà Nội | CN 20/09 · 07:00 | Tuấn | 8/10
3. Ăn uống | "Food tour Sài Gòn: chợ Bến Thành → hẻm 76" | Chợ Bến Thành | TP. Hồ Chí Minh | T7 19/09 · 17:30 | Trang | 3/6
4. Nhậu | "Nhậu xem bóng U23, ai liền tay!" | Quán bia craft Q.1 | TP. Hồ Chí Minh | T4 23/09 · 20:00 | Hùng | 5/8
5. Xem phim | "Xem phim kinh dị mới, đi lẻ tìm nhóm" | BHD Q.7 | TP. Hồ Chí Minh | T6 25/09 · 19:45 | My | 1/3
6. Du lịch | "Phượt Đà Lạt 2N1Đ, chia xăng chia phòng" | Xuất phát Q.1 | TP. Hồ Chí Minh | T7 26/09 · 05:30 | Nam | 2/4
7. Cà phê | "Cà phê see + chạy bộ biển sớm" | Bãi biển Phạm Văn Đồng | Đà Nẵng | CN 20/09 · 06:30 | Vy | 4/6
8. Ăn uống | "Hải sản cuối tuần, đi nhóm 5 quẩy tới bến" | Phố Trần Phú | Nha Trang | T5 24/09 · 18:00 | Khoa | 3/5

### Pin trên map (city → số kèo + titles popup)
- Hà Nội: bài 1, 2 · TP. Hồ Chí Minh: bài 3, 4, 5, 6 · Đà Nẵng: bài 7 · Nha Trang: bài 8
- Các thành phố khác trên map (không pin): Huế, Quy Nhơn, Đà Lạt, Cần Thơ, Phú Quốc, Hải Phòng, Vũng Tàu — có thể hiển thị tên nhỏ làm "đã mở rộng sớm" (optional)

### 6 danh mục (icon pixel vẽ tay: cốc cà phê / tô phở / máy bay hoặc cây + vali / diascope phim / cốc bia / quả bóng đá)
Cà phê · Ăn uống · Du lịch · Xem phim · Nhậu · Đá banh

## 4. Tài sản kỹ thuật
### Bản đồ (BẮT BUỘC dùng file thật, không vẽ tay lại hình Việt Nam)
- Read `assets/vnmap.json`: lấy `coarse.map` (32 cột × 61 dòng, chuỗi '.'/'#') + `citiesCoarse` (col/row từng thành phố) → inline vào HTML dưới dạng mảng JS.
- Render: canvas hoặc box-shadow, cell 6–10px, `image-rendering: pixelated`. Pin đặt tại tâm cell: x=(col+0.5)*cell, y=(row+0.5)*cell. Pin nhỏ hơn 14px sẽ khó click → pin ≥ 16px + tooltip.
- Lưu ý: pin Phú Quốc ở ngoài đảo (col 7, row 51 đã nudge về island pixel). Nếu pin trôi "trong biển" 1 cell vẫn chấp nhận được về thẩm mỹ pixel, đừng xê dịch về đất sâu.

### Logo (inline nguyên bản SVG đã tải, KHÔNG tái tạo)
- `assets/google-g.svg` (742 bytes) · `assets/facebook-icon.svg` (1.9KB) — Read rồi dán thẳng vào HTML.

### Font — link một lần
`https://fonts.googleapis.com/css2?family=VT323&family=Handjet:wght@400..800&family=Chakra+Petch:wght@400;500;600;700&family=Press+Start+2P&display=swap`
- VT323/Handjet/Chakra Petch có subset tiếng Việt (đã verify). Press Start 2P KHÔNG có → chỉ dùng cho chữ không dấu + "KÈO ĐÊ" (Đ/È/Ê thuộc latin-ext, render được).
- Body text tiếng Việt ≥16px; nếu dùng VT323 cho body thì ≥20px. Contrast ≥4.5:1.

## 5. Ràng buộc kỹ thuật & chất lượng (hard rules)
1. **1 file HTML tự chứa** (double-click mở được), vanilla JS, KHÔNG framework, KHÔNG tài nguyên ngoài trừ Google Fonts.
2. `<html lang="vi">`, `<title>` có tên hướng. Hash `#main` → thẳng màn APP. Nút đăng nhập → APP. Lưu trạng thái vào biến (không cần localStorage).
3. Mọi tương tác THẬT: lọc chips, nút Rủ (count+1, 1 lần/bài), mở/đóng modal (nút X + Escape), popup pin, toast.
4. **Pixel craft:** không border-radius mềm (nếu cần bo dùng bậc thang clip-path), không box-shadow blur, không gradient mượt (dither bằng repeating-gradient được), không emoji làm icon category (vẽ icon pixel bằng CSS grid/box-shadow/SVG rect theo lưới). Avatar = pixel face 5×5 hình học, KHÔNG vẽ mặt người chi tiết (anti-slop).
5. **Đọc được:** body ≥16px (VT323 ≥20px), label ≥12px, contrast ≥4.5:1, viewport thiết kế 1440×900, không overflow ngang, map không bị bóp méo (giữ ratio 32:61).
6. Anti-slop: không purple gradient, không glow blur, không thẻ card + viền màu trái trái kiểu Tailwind 2020, không data slop (số liệu phải phục vụ UI).
7. HTML mở đầu bằng comment: ASSUMPTIONS (tên sản phẩm giả định, dữ liệu mẫu…) + 1 dòng `FORM: <form đến từ nội dung đâu — visual motif>`.
8. Tự kiểm tra bằng Playwright trước khi báo xong (bat buộc):
   ```
   npx playwright screenshot "file:///C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos/<file>.html" <out>.png --viewport-size=1440,900
   npx playwright screenshot "file:///C:/Users/txt64/.zcode/workspace/default/ru-re-tim-keo/design-demos/<file>.html#main" <out2>.png --viewport-size=1440,900
   ```
   Xem lại ảnh (Read) và sửa: dấu tiếng Việt render đúng font (không tofu/fallback), pin nằm gần đúng vị trí, không chồng lấn, modal vừa màn hình. Tối thiểu 1 vòng sửa.
9. Console/click test (nếu kịp): node script `require('playwright')` (module resolve được ở `C:\Users\txt64\node_modules`) — click login → filter chip → mở modal → click pin, thu `pageerror`. Không bắt buộc nhưng nên.
10. Số dòng HTML mục tiêu ≤ 1100; nếu vượt, giữ CSS gọn (biến màu, class dùng chung).

## 6. Đầu ra
- File: `design-demos/A-gameboy-quest.html` | `design-demos/B-arcade-night.html` | `design-demos/C-candy-town.html`
- KHÔNG thêm watermark, KHÔNG tự thêm page/tiện ích ngoài spec.
