# brand-spec.md — KÈO ĐÊ (prototype)

## Sản phẩm
- **Tên (giả định, chờ user chốt):** KÈO ĐÊ — wordmark pixel: `KÈO ĐÊ!`
- **Tagline:** "Rủ nhau đi kèo — kèo nào cũng có người đi cùng."
- **Bản chất:** mạng xã hội rủ rê meetup theo chủ đề (cà phê, ăn uống, du lịch, xem phim, nhậu, đá banh…), đăng bài kèm vị trí + thời gian, bản đồ toàn Việt Nam. Đăng nhập Google/Facebook. Tương lai: mobile app.

## Tài sản logo bắt buộc (đã tải, inline vào HTML)
- `assets/google-g.svg` — Google "G" đa màu chính thức (Wikimedia). Dùng nguyên màu gốc: #4285F4 / #EA4335 / #FBBC05 / #34A853.
- `assets/facebook-icon.svg` — Facebook icon chính thức 2023 (Wikimedia). Màu gốc #0866FF.
- **Cấm vẽ lại/chuyển màu logo Google & Facebook.** Kích thước hiển thị đề xuất: 18–20px trong nút đăng nhập.

## Quy tắc hiển thị logo
- Nút đăng nhập: logo bên trái + label "Tiếp tục với Google" / "Tiếp tục với Facebook".
- Không thêm hiệu ứng làm méo logo (no rotate, no tint, no pixelate logo thật).
- Tương phản nút ≥ 4.5:1 với label.

## Font (đã verify subset tiếng Việt trên Google Fonts)
| Font | Subset vi | Vai trò |
|---|---|---|
| VT323 | ✅ vietnamese | body pixel monospace (cỡ ≥20px mới đọc tốt) |
| Handjet (variable 400–800) | ✅ vietnamese | display pixel headline |
| Chakra Petch | ✅ vietnamese | UI label/body phụ (15–16px) |
| Press Start 2P | ❌ KHÔNG có vi | CHỈ dùng cho chữ latin/số: "KÈO ĐÊ" (Đ, È, Ê nằm trong latin-ext nên render được), "PRESS START", số điểm |
Link CSS2 một lần: `https://fonts.googleapis.com/css2?family=VT323&family=Handjet:wght@400..800&family=Chakra+Petch:wght@400;500;600;700&family=Press+Start+2P&display=swap`

## Nguồn dữ liệu bản đồ
- `assets/vnmap.json` — raster hóa từ geoBoundaries gbOpen VNM ADM0 (CC BY 4.0). Ghi credit trong footer: "Map data © geoBoundaries (CC BY 4.0)".
