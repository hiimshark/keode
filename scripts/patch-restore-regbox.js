// Khôi phục regbox (khung tạo tài khoản email) bị mất bởi lần phẫu thuật trước.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
if (h.includes('id="regName"')) { console.log('regbox vẫn còn — không làm gì'); process.exit(0); }
const anchor = '      <div id="cfgPanel" class="cfgpanel hide">';
const regbox = `      <div class="regbox">
        <div class="phsep">— hoặc tạo tài khoản / đăng nhập bằng email —</div>
        <input id="regName" maxlength="40" placeholder="Tên hiển thị (vd: Lê Hoàng Vũ)">
        <input id="regEmail" inputmode="email" autocomplete="email" placeholder="Email">
        <input id="regPass" type="password" autocomplete="current-password" placeholder="Mật khẩu (tối thiểu 6 ký tự)">
        <p class="err hide" id="regErr"></p>
        <div style="display:flex;gap:8px">
          <button id="regBtn" class="btn btn-p" type="button" style="flex:1">Tạo tài khoản</button>
          <button id="regSwitch" class="btn" type="button">Đã có tài khoản? Đăng nhập</button>
        </div>
        <p class="lsmall" style="margin-top:8px">Chưa cần CCCD lúc đăng ký — xác minh danh tính làm sau trong app, tuỳ bạn.</p>
      </div>
      `;
if (!h.includes(anchor)) { console.log('cfgPanel anchor not found'); process.exit(1); }
h = h.replace(anchor, () => regbox + anchor);
fs.writeFileSync('keo-de.html', h);
console.log('regbox restored');
