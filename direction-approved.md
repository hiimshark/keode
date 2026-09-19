# direction-approved.md — Gate: lựa chọn hướng thiết kế (user đã chọn)

## Ba bản nháp đã trình bày (cùng nội dung, khác hướng xử lý)
| Hướng | File | Screenshot | Logic chọn |
|---|---|---|---|
| A — Game Boy Quest | `design-demos/A-gameboy-quest.html` | `A-login.png`, `A-app.png` | 🎲 Xúc xắc giây (32) → entry Pixel-Game trong style library; diễn giải DMG 4 màu xanh |
| B — Arcade Night | `design-demos/B-arcade-night.html` | `B-login.png`, `B-app.png` | 🏆 Tham chiếu thật pota.tto (không verify được online từ máy này, đã ghi assumption) |
| C — Candy Pixel Town | `design-demos/C-candy-town.html` | `C-login.png`, `C-app.png` | 🧠 Best-designer: Panic/Playdate + entry Friendly Geometric Candy |

## Lựa chọn của user (nguyên văn qua AskUserQuestion)
1. Câu 1 "Chọn hướng thiết kế để mình hoàn thiện bản chính?" → **"Mix vài hướng"**
2. Câu 2 "Mix theo công thức nào?" → **"C nền + map CRT của B (Recommended)"**

## Công thức chốt cho bản chính
- Nền/tổng thể/layout/micro-copy: **C — Candy Pixel Town** (kem ấm, card kẹo bóng đổ cứng, bảng tin khu phố)
- Khối bản đồ Việt Nam: **B — Arcade Night** (bezel CRT nền tối, đất phosphor green, pin neon + badge số kèo, popup dạng tấm plate tối)
- Bản chính: `keo-de.html` (root project), giữ nguyên mọi interaction đã verify ở C (login, filter chips, rủ 1 lần, modal X/Escape, toast, pin popup) + credit geoBoundaries.

## 🔄 Đổi hướng v0.4 (nguyên văn user): "tôi k thích pixel nữa tui thích giao diện như của cokeo á"
- Bỏ ngôn ngữ pixel → skin hiện đại kiểu cokeo.vn: nền #F4F6FB, card trắng bo 16px, accent xanh #2E5BE8,
  avatar tròn màu, icon emoji vòng tròn pastel, font Baloo 2 + Be Vietnam Pro.
- Bản đồ: SVG biên giới TP.HCM thật (ADM1) thay cho pixel map. Logic/tính năng giữ nguyên v0.3.
