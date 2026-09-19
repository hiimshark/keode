// v0.9: Tạo tài khoản email + Xác minh CCCD (upload 2 ảnh → admin duyệt → badge) + policy chặt.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* ============ 1. CSS ============ */
rep(`@media (max-width:1120px){`,
`/* ---------- KYC + xác minh ---------- */
.vtag{display:inline-flex;align-items:center;gap:3px;background:var(--green-t);color:var(--green);font:700 10.5px "Be Vietnam Pro",sans-serif;padding:1px 7px;border-radius:999px}
.uvt{display:inline-flex;align-items:center;gap:3px;background:var(--amber-t);color:#7A5200;font:600 10.5px "Be Vietnam Pro",sans-serif;padding:1px 7px;border-radius:999px}
.kycbanner{margin:10px 0 0;background:var(--amber-t);border:1.5px dashed var(--amber);border-radius:14px;padding:11px 14px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.kycbanner.wait{background:var(--blue-t);border-color:var(--blue)}
.kycbanner.ok{background:var(--green-t);border-color:var(--green)}
.kycbanner p{margin:0;font-size:13.5px;color:var(--navy);flex:1;min-width:200px}
.regbox{border-top:2px dashed var(--line2);margin-top:12px;padding-top:12px;text-align:left}
.regbox input{width:100%;border:1.5px solid var(--line2);border-radius:10px;padding:9px 12px;font:500 14px "Be Vietnam Pro",sans-serif;color:var(--navy);outline:none;margin-bottom:8px}
.regbox input:focus{border-color:var(--blue);box-shadow:0 0 0 4px var(--blue-t)}
.regbox .err{margin:4px 0}
.kslot{border:1.5px dashed var(--line2);border-radius:12px;padding:12px;margin-bottom:10px;text-align:center}
.kslot.has{border-style:solid;border-color:var(--green)}
.kslot label{display:inline-block;cursor:pointer}
.kslot img{max-width:100%;max-height:150px;border-radius:10px;margin-top:8px;display:block;margin-left:auto;margin-right:auto}
.kslot .kh{font:600 13px "Be Vietnam Pro",sans-serif;color:var(--navy)}
.kycagree{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:var(--mut);margin:10px 0}
.kycagree input{margin-top:2px}

@media (max-width:1120px){`, 'kyc css');

/* ============ 2. LOGIN: regbox ============ */
rep(`        <a class="linklike" href="#admin" style="color:var(--mut)">Quản trị</a>`,
`        <a class="linklike" href="#admin" style="color:var(--mut)">Quản trị</a>
      </div>
      <div class="regbox">
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
      <div class="cfgbar">
        <button type="button" class="linklike" id="cfgToggle" style="display:none">⚙️ Cấu hình đăng nhập thật (làm 1 lần)</button>`, 'login regbox');

/* ============ 3. GREET: kyc banner + tên động ============ */
rep(`    <h1>Chào Minh! Hôm nay rủ gì đây?</h1>
    <p id="greetsub"></p>`,
`    <h1 id="greetHi"></h1>
    <p id="greetsub"></p>
    <div id="kycBanner" class="hide"></div>`, 'greet kyc');

/* ============ 4. ADMIN: tab kyc ============ */
rep(`        <button class="tab" data-at="requests" type="button">Yêu cầu quán</button>`,
`        <button class="tab" data-at="kyc" type="button">Xác minh CCCD <span class="chipst st-hid" id="kycCount"></span></button>
        <button class="tab" data-at="requests" type="button">Yêu cầu quán</button>`, 'admin kyc tab');

/* ============ 5. Modal KYC ============ */
rep(`<!-- ============ MODAL QUÁN ĐỐI TÁC (admin) ============ -->`,
`<!-- ============ MODAL: XÁC MINH CCCD ============ -->
<div class="overlay hide" id="kycOverlay">
  <div class="modal" role="dialog" aria-modal="true">
    <div class="mhead">
      <h2 id="kycTitle">Xác minh danh tính</h2>
      <button class="pop-x" id="kycClose" type="button" aria-label="Đóng" style="width:34px;height:34px;font-size:15px;border:2px solid var(--line);background:var(--cream2);color:var(--ink)">✕</button>
    </div>
    <div id="kycBody"></div>
  </div>
</div>

<!-- ============ MODAL QUÁN ĐỐI TÁC (admin) ============ -->`, 'kyc modal html');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v09 part1 OK');
process.exit(missing.length ? 1 : 0);
