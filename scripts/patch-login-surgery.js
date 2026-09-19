// Phẫu thuật login: gỡ trùng lặp, cfgBar chỉ hiện khi CHƯA có config; sửa rules placeholder còn sót.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');

/* 1. Cắt vùng lộn xộn giữa đóng nút Google và mở cfgPanel, thay bằng cấu trúc sạch */
const START = '          </button>\n          <div id="gsiBtn" class="gwide hide"></div>';
const END = '<div id="cfgPanel" class="cfgpanel hide">';
const s = h.indexOf(START), e = h.indexOf(END);
if (s < 0 || e < 0) { console.log('anchors not found'); process.exit(1); }
const clean = `          </button>
          <div id="gsiBtn" class="gwide hide"></div>
        </div>
      </div>
      <p class="lsmall">Đăng nhập thật qua Google — tên, email và ảnh đại diện lấy trực tiếp từ tài khoản của bạn. Dùng dịch vụ nghĩa là bạn đồng ý <a class="linklike" style="text-decoration:underline;text-transform:none;letter-spacing:0" href="#policy">Điều khoản</a> &amp; <a class="linklike" style="text-decoration:underline" href="#policy">Chính sách quyền riêng tư</a>.</p>
      <div class="cfgbar" id="cfgBar" style="display:none">
        <button type="button" class="linklike" id="cfgToggle">⚙️ Cấu hình đăng nhập thật (làm 1 lần)</button>
        <button type="button" class="linklike" id="demoLink">Chưa có ID? Xem thử demo →</button>
      </div>
      `;
h = h.slice(0, s) + clean + h.slice(e);

/* 2. renderLoginAuth: điều khiển cfgBar — có config thì ẩn hẳn */
const a2 = `function renderLoginAuth(){`;
const i2 = h.indexOf(a2);
if (i2 >= 0) {
  const j2 = h.indexOf('}\n', i2);
  const fnEnd = h.indexOf('\n}', i2);
  h = h.slice(0, i2) + `function renderLoginAuth(){
  const bar = $('#cfgBar');
  if (bar) bar.style.display = fbValid(FB) ? 'none' : 'flex';
` + h.slice(fnEnd + 1);
} else { console.log('renderLoginAuth not found'); process.exit(1); }

fs.writeFileSync('keo-de.html', h);

/* 3. rules: thay placeholder CÒN SÓT (dòng code, không phải comment) */
let r = fs.readFileSync('firestore.rules', 'utf8');
r = r.split("'DÁN_UID_ADMIN_VÀO_ĐÂY'").join("'mFbMQbKE5jhCR83aYBbSknoHdT42'");
r = r.replace("// ⚠️ THAY 'mFbMQbKE5jhCR83aYBbSknoHdT42' bằng User UID của Lê Hoàng Vũ\n  //    (Firebase Console → Authentication → Users → cột User UID)\n",
  "// Admin: Lê Hoàng Vũ (User UID)\n");
fs.writeFileSync('firestore.rules', r);
console.log('done');
