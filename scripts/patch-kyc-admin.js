// v0.9.7: KYC admin — hiện hướng dẫn khi trình duyệt không có phiên Firebase admin (trước đó bị nuốt lỗi).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 60)); return; }
  h = h.replace(a, () => b);
}

/* 1. Biến KYC_ERR */
rep(`let CLOUD_VERIFIED={},KYC_C=[];`,
`let CLOUD_VERIFIED={},KYC_C=[],KYC_ERR=null;`, 'KYC_ERR var');

/* 2. kyc snapshot: bắt lỗi vào KYC_ERR (admin) */
rep(`    if(isAdmin()){
      db.collection('kyc').onSnapshot(s=>{KYC_ERR=null;KYC_C=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(aTab==='kyc')renderAdminBody();updateKycBanner();},()=>{});
    }else if(session&&session.id){
      db.collection('kyc').doc(String(session.id)).onSnapshot(d=>{KYC_C=d.exists?[Object.assign({id:d.id},d.data())]:[];updateKycBanner();},()=>{});
    }`,
`    if(isAdmin()){
      db.collection('kyc').onSnapshot(s=>{KYC_ERR=null;KYC_C=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(aTab==='kyc')renderAdminBody();updateKycBanner();},e=>{KYC_ERR=e.code||e.message;if(aTab==='kyc')renderAdminBody();});
    }else if(session&&session.id){
      db.collection('kyc').doc(String(session.id)).onSnapshot(d=>{KYC_C=d.exists?[Object.assign({id:d.id},d.data())]:[];updateKycBanner();},()=>{});
    }`, 'kyc snapshot err');

/* 3. Tab KYC: hiện hướng dẫn khi bị chặn quyền */
rep(`  }else if(aTab==='kyc'){
    const Q=(MODE==='cloud')?KYC_C:KYC;
    const kc=\$('#kycCount');if(kc)kc.textContent=Q.length||'';`,
`  }else if(aTab==='kyc'){
    if(KYC_ERR&&(String(KYC_ERR).includes('permission')||String(KYC_ERR).includes('insufficient'))){
      body.innerHTML=\`
      <div class="sechead"><div><div class="kicker">An toàn</div><h2>Xác minh CCCD</h2></div></div>
      <div class="latewarn" style="margin-bottom:14px">🔒 Trình duyệt này <b>chưa có phiên đăng nhập Firebase của admin</b> — vì bảo mật, ảnh CCCD chỉ admin đăng nhập đúng tài khoản mới xem được.</div>
      <div class="acard"><h3>Cách mở quyền (1 phút)</h3>
        <ol style="padding-left:18px;font-size:14px;color:var(--ink);line-height:1.7">
          <li>Bấm <b>Thoát</b> (góc trên phải) để về trang web.</li>
          <li>Đăng xuất (nếu đang dùng tài khoản khác) → đăng nhập bằng <b>Google của Lê Hoàng Vũ</b> — đúng tài khoản admin đã cấp UID.</li>
          <li>Vào lại <b>#admin</b> → tab <b>Xác minh CCCD</b> → duyệt hồ sơ.</li>
        </ol>
        <p style="font-size:12px;color:var(--mut)">Mã lỗi kỹ thuật: \${esc(String(KYC_ERR))}</p>
      </div>\`;
      return;
    }
    const Q=(MODE==='cloud')?KYC_C:KYC;
    const kc=\$('#kycCount');if(kc)kc.textContent=Q.length||'';`, 'admin kyc guidance');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch kyc-admin OK');
process.exit(missing.length ? 1 : 0);
