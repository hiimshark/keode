// v0.7: Firestore cloud mode + Phone OTP + Policy + xoá kèo + kèo tự ẩn + cảnh báo kèo khuya
//       + xác minh quán & kênh liên hệ FB/Zalo + gói deploy.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, b);
}
function repAll(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.split(a).join(b);
}

/* ============ 1. CSS ============ */
rep(`@media (max-width:1120px){`,
`/* policy + phone + mode badge + cảnh báo khuya */
.phsep{text-align:center;font:600 12px "Be Vietnam Pro",sans-serif;color:var(--mut);margin:2px 0 0;letter-spacing:.04em}
.phonebox{border:1.5px dashed var(--line2);border-radius:12px;padding:10px;background:#FBFCFF}
.prow{display:flex;gap:8px;align-items:center}
.prow .pre{font:700 14px "Be Vietnam Pro",sans-serif;color:var(--navy);background:var(--cream2);border-radius:10px;padding:9px 10px}
.prow input{flex:1;min-width:0;border:1.5px solid var(--line2);border-radius:10px;padding:9px 12px;font:500 14px "Be Vietnam Pro",sans-serif;color:var(--navy);outline:none}
.prow input:focus{border-color:var(--blue);box-shadow:0 0 0 4px var(--blue-t)}
#recaptcha-box{font-size:11px}
.mbadge{font:600 12px "Be Vietnam Pro",sans-serif;border-radius:999px;padding:5px 12px}
.mbadge.mloc{background:var(--cream2);color:var(--ink2)}
.mbadge.mcon{background:var(--amber-t);color:#7A5200}
.mbadge.mcld{background:var(--green-t);color:var(--green)}
.ptabs{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0 16px}
.ptab{border:1.5px solid var(--line2);background:#fff;border-radius:999px;padding:8px 16px;font:600 13.5px "Be Vietnam Pro",sans-serif;color:var(--navy)}
.ptab.on{background:var(--blue);border-color:var(--blue);color:#fff}
.policycard{background:#fff;border:1px solid var(--line);border-radius:var(--r);box-shadow:var(--sh-sm);padding:22px 26px;margin-bottom:16px}
.policycard h3{font-family:"Baloo 2";font-weight:700;font-size:19px;color:var(--navy);margin:18px 0 6px}
.policycard h3:first-child{margin-top:0}
.policycard p,.policycard li{font-size:14px;color:var(--ink);line-height:1.65}
.policycard ul{margin:6px 0 0;padding-left:20px}
.policycard a{color:var(--blue)}
.latewarn{background:#FFF1F3;border:1.5px solid var(--pink);border-radius:14px;padding:12px 15px;margin:10px 0 4px;font:600 13.5px "Be Vietnam Pro",sans-serif;color:#B3124A}
.ctag.r{background:var(--pink);color:#fff}

@media (max-width:1120px){`, 'css block');

/* ============ 2. LOGIN: thêm policy link + phone OTP ============ */
rep(`<p class="lsmall">Đăng nhập thật qua Google / Facebook — tên, email và ảnh đại diện lấy trực tiếp từ tài khoản của bạn. Lần đầu cần cấu hình ID (dưới đây, làm 1 lần).</p>`,
`<p class="lsmall">Đăng nhập thật qua Google / Facebook — tên, email và ảnh đại diện lấy trực tiếp từ tài khoản của bạn. Dùng dịch vụ nghĩa là bạn đồng ý <a class="linklike" style="text-decoration:underline;text-transform:none;letter-spacing:0" href="#policy">Điều khoản</a> &amp; <a class="linklike" style="text-decoration:underline" href="#policy">Chính sách quyền riêng tư</a>.</p>`, 'login lsmall');

rep(`            Tiếp tục với Facebook
          </button>
        </div>`,
`            Tiếp tục với Facebook
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

/* ============ 3. FOOTER: policy links + v0.7 ============ */
rep(`KÈO ĐÊ — bản mẫu thiết kế (prototype v0.6 · chỉ TP. Hồ Chí Minh) · Map data © geoBoundaries (CC BY 4.0)
    <button type="button" id="resetKeo" class="freset">Xoá hết kèo (demo)</button>`,
`KÈO ĐÊ — bản mẫu thiết kế (prototype v0.7 · chỉ TP. Hồ Chí Minh) · Map data © geoBoundaries (CC BY 4.0) ·
    <a href="#policy" style="color:var(--blue);text-decoration:none">Điều khoản</a> ·
    <a href="#policy" style="color:var(--blue);text-decoration:none">Quyền riêng tư</a> ·
    <a href="#policy" style="color:var(--blue);text-decoration:none">An toàn cộng đồng</a>
    <button type="button" id="resetKeo" class="freset">Xoá hết kèo (demo)</button>`, 'footer');

/* ============ 4. DISCOVER: mode badge ============ */
rep(`<div class="ctl"><span class="rescount" id="rescount"></span>
          <select id="sortSel" aria-label="Sắp xếp">`,
`<div class="ctl"><span class="mbadge mloc" id="modeBadge"></span><span class="rescount" id="rescount"></span>
          <select id="sortSel" aria-label="Sắp xếp">`, 'mode badge');

/* ============ 5. MODAL: expiry select ============ */
rep(`      <label class="flab" for="fdesc">Mô tả ngắn</label>`,
`      <label class="flab" for="fexp">Kèo tự biến mất sau <small>(tránh kèo cũ tồn đọng — chủ kèo vẫn thấy trong "Kèo của tôi")</small></label>
      <select id="fexp">
        <option value="12">Kết thúc kèo + 12 giờ</option>
        <option value="24" selected>Kết thúc kèo + 1 ngày</option>
        <option value="72">Kết thúc kèo + 3 ngày</option>
        <option value="0">Không tự ẩn</option>
      </select>
      <label class="flab" for="fdesc">Mô tả ngắn</label>`, 'expiry select');

/* ============ 6. VENUES: xác minh note + liên hệ FB/Zalo thật ============ */
rep(`        <h3>\${esc(pt.name)}</h3>
        <div class="kmeta"><svg class="pinic" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>\${esc(pt.district)} · \${pt.tags.map(esc).join(' · ')}</div>
        <div style="font-size:13.5px;color:var(--mut)">\${esc(pt.note)}</div>`,
`        <h3>\${esc(pt.name)}</h3>
        <div class="kmeta"><svg class="pinic" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M21 10c0 7-9 12-9 12s-9-5-9-12a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>\${esc(pt.district)} · \${pt.tags.map(esc).join(' · ')}</div>
        <div style="font-size:12.5px;color:var(--green);font-weight:600">✓ Quán đã qua xác minh của chủ hệ thống</div>
        <div style="font-size:13.5px;color:var(--mut)">\${esc(pt.note)}</div>`, 'venue verified note');

rep(`        <p style="color:var(--mut);font-size:14px;margin:6px 0 4px">Để lại thông tin — chủ hệ thống <b style="color:var(--navy)">Lê Hoàng Vũ</b> sẽ liên hệ trong 24h để chụp ảnh, xác thực và lên lịch đề xuất cho quán.</p>`,
`        <p style="color:var(--mut);font-size:14px;margin:6px 0 8px">Để lại thông tin — chủ hệ thống <b style="color:var(--navy)">Lê Hoàng Vũ</b> sẽ liên hệ trong 24h để chụp ảnh, xác thực và lên lịch đề xuất cho quán. Hoặc liên hệ trực tiếp:</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:4px">
          <a class="btn btn-sm" style="text-decoration:none" href="https://www.facebook.com/SharkHunter01" target="_blank" rel="noopener">📘 Facebook: SharkHunter01</a>
          <a class="btn btn-sm" style="text-decoration:none" href="https://zalo.me/0328206839" target="_blank" rel="noopener">💬 Zalo: 0328206839</a>
        </div>`, 'venue contacts');

/* ============ 7. POLICY VIEW (chèn trước MODAL) ============ */
rep(`<!-- ============ MODAL: TẠO KÈO ============ -->`,
`<!-- ============ POLICY ============ -->
<div id="view-policy" class="hide">
  <div class="wrap" style="max-width:860px">
    <button class="btn dback" id="policyBack" type="button" aria-label="Quay lại">←</button>
    <div class="sechead"><div><div class="kicker">KÈO ĐÊ · TP. Hồ Chí Minh</div><h2 style="font-size:34px">Điều khoản · Quyền riêng tư · An toàn</h2></div></div>
    <div class="ptabs">
      <button class="ptab on" data-pt="terms" type="button">Điều khoản sử dụng</button>
      <button class="ptab" data-pt="privacy" type="button">Chính sách quyền riêng tư</button>
      <button class="ptab" data-pt="safety" type="button">An toàn cộng đồng</button>
    </div>
    <div class="policycard" id="policyBody"></div>
    <p class="crt-soon" style="margin:4px 0 40px">Cập nhật lần cuối: 19/09/2026 · Bản mẫu — cần luật sư rà soát trước khi vận hành thương mại.</p>
  </div>
</div>

<!-- ============ MODAL: TẠO KÈO ============ -->`, 'policy view');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'HTML patches OK');
process.exit(missing.length ? 1 : 0);
