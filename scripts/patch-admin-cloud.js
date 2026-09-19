// v0.9.8: Admin Panel tự kết nối cloud — panel và web thấy chung dữ liệu.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. renderAdminView: admin đăng nhập → tự nối cloud */
rep(`function renderAdminView(){
  const loginBox=\$('#adminLogin'),panel=\$('#adminPanel');
  if(!adminS){panel.classList.add('hide');loginBox.classList.remove('hide');return;}
  loginBox.classList.add('hide');panel.classList.remove('hide');
  \$\$('#atabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.at===aTab));
  renderAdminBody();
}`,
`function renderAdminView(){
  const loginBox=\$('#adminLogin'),panel=\$('#adminPanel');
  if(!adminS){panel.classList.add('hide');loginBox.classList.remove('hide');return;}
  loginBox.classList.add('hide');panel.classList.remove('hide');
  \$\$('#atabs .tab').forEach(t=>t.classList.toggle('on',t.dataset.at===aTab));
  /* admin panel nhìn chung một nguồn dữ liệu cloud với web */
  if(fbValid(FB)&&MODE!=='cloud'&&!cloudConnecting){cloudConnecting=true;initCloud();}
  renderAdminBody();
}`, 'admin cloud init');

/* 2. Tổng quan admin: hiện trạng thái Firebase auth + hướng dẫn để sửa/xoá cloud */
rep(`      <div class="acard"><h3>Thao tác nhanh</h3>
        <a class="btn btn-sm" style="text-decoration:none" href="#discover">← Về bảng tin</a>
        <button class="abtn danger" data-act="clearkeo" type="button" style="margin-left:8px">Xoá toàn bộ kèo</button>
      </div>\`;`,
`      <div class="acard"><h3>Trạng thái</h3>
        <p style="margin:0 0 8px;font-size:13.5px;color:var(--mut)">\${MODE==='cloud'
          ?'☁️ Đang nhìn dữ liệu cloud — cùng nguồn với bảng tin của người dùng.'
          :'💾 Chưa kết nối cloud — đang xem dữ liệu máy này.'}
          \${MODE==='cloud'&&!(window.firebase&&firebase.auth()&&firebase.auth().currentUser)
            ?'<br><b style="color:var(--amber)">💡 Để sửa/xoá kèo trên cloud từ panel: đăng nhập Google bằng tài khoản admin (Lê Hoàng Vũ) ở tab web cùng trình duyệt này.</b>':''}</p>
      </div>
      <div class="acard"><h3>Thao tác nhanh</h3>
        <a class="btn btn-sm" style="text-decoration:none" href="#discover">← Về bảng tin</a>
        <button class="abtn danger" data-act="clearkeo" type="button" style="margin-left:8px">Xoá toàn bộ kèo</button>
      </div>\`;`, 'admin status');

/* 3. admin kèo table khi chưa có quyền ghi cloud: thêm ghi chú rõ */
rep(`      <p class="crt-soon">Sửa kèo mở khung chỉnh sửa đầy đủ (món, địa điểm, giờ, số chỗ, tự ẩn…). Xoá kèo cần xác nhận. Lưu ý cloud: sửa/xoá kèo của người khác cần quyền admin trên server (custom claim).</p>\`;`,
`      <p class="crt-soon">Sửa kèo mở khung chỉnh sửa đầy đủ (món, địa điểm, giờ, số chỗ, tự ẩn…). Xoá kèo cần xác nhận. \${MODE==='cloud'?'Kèo lưu trên cloud — để sửa/xoá kèo của người khác, đăng nhập Google bằng tài khoản admin trong trình duyệt này.':''}</p>\`;`, 'admin keos note');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'admin cloud OK');
process.exit(missing.length ? 1 : 0);
