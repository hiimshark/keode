// Xoá đăng nhập OTP (HTML + JS handlers) theo yêu cầu user.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. HTML: gỡ khối OTP */
rep(`          </button>
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
        </div>`,
`          </button>
        </div>`, 'otp html');

/* 2. JS: gỡ handlers OTP */
const a2 = '/* ---- Đăng nhập số điện thoại (Firebase Phone OTP — cần bật Phone provider; SMS thật cần bật billing, số test miễn phí trong console) ---- */';
const i = h.indexOf(a2);
if (i < 0) { missing.push('otp js block'); }
else {
  const j = h.indexOf('\n});', h.indexOf("$('#phVerify')"));
  if (j < 0) { missing.push('otp js end'); }
  else { h = h.slice(0, i) + h.slice(j + 4); }
}

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'OTP removed OK');
process.exit(missing.length ? 1 : 0);
