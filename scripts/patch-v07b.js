// v0.7 patch B: HTML còn lại (phone UI + footer + CSP + version)
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label); return; }
  h = h.replace(a, b);
}

// 1. Phone OTP UI (sau nút Facebook, trong .lbtns)
rep(`          Tiếp tục với Facebook
        </button>
      </div>`,
`          Tiếp tục với Facebook
          </button>
          <div class="phsep">— hoặc đăng nhập bằng số điện thoại (OTP) —</div>
          <div class="phonebox">
            <div class="prow">
              <span class="pre">+84</span>
              <input id="phNum" inputmode="tel" maxlength="11" placeholder="0909123456">
              <button id="phSend" class="btn btn-sm" type="button">Gửi mã</button>
            </div>
            <div class="prow hide" id="phCodeRow" style="margin-top:8px">
              <input id="phCode" inputmode="numeric" maxlength="6" placeholder="Mã 6 số">
              <button id="phVerify" class="btn btn-p btn-sm" type="button">Xác nhận</button>
            </div>
            <div id="recaptcha-box"></div>
          </div>
        </div>`, 'phone UI');

// 2. Footer: v0.7 + policy links
rep(`  <footer class="foot">KÈO ĐÊ — bản mẫu thiết kế (prototype v0.4 · chỉ TP. Hồ Chí Minh) · Map data © geoBoundaries (CC BY 4.0)
    <button type="button" id="resetKeo" class="freset">Xoá hết kèo (demo)</button>`,
`  <footer class="foot">KÈO ĐÊ — bản mẫu thiết kế (prototype v0.7 · chỉ TP. Hồ Chí Minh) · Map data © geoBoundaries (CC BY 4.0) ·
    <a href="#policy" style="color:var(--blue);text-decoration:none">Điều khoản</a> ·
    <a href="#policy" style="color:var(--blue);text-decoration:none">Quyền riêng tư</a> ·
    <a href="#policy" style="color:var(--blue);text-decoration:none">An toàn cộng đồng</a>
    <button type="button" id="resetKeo" class="freset">Xoá hết kèo (demo)</button>`, 'footer');

// 3. Bảo mật: CSP + referrer (cho phép đúng những nguồn app dùng)
rep(`<meta name="viewport" content="width=device-width, initial-scale=1">`,
`<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com https://apis.google.com https://accounts.google.com https://connect.facebook.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://api.stripe.com wss://*.firebaseio.com https://apis.google.com https://www.google.com; frame-src https://accounts.google.com https://*.firebaseapp.com https://*.web.app https://www.facebook.com;">`, 'csp');

// 4. Version head comment
rep(`KÈO ĐÊ — v0.4 "COKEO-STYLE"`, `KÈO ĐÊ — v0.7 "COKEO-STYLE + CLOUD"`, 'head version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch B OK');
process.exit(missing.length ? 1 : 0);
