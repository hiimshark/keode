// v0.9 patch D: initCloud snapshots + kycOverlay const + khôi phục Escape handler + version.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 70)); return; }
  h = h.replace(a, () => b);
}

/* 1. initCloud: thêm snapshots cho verifications + kyc */
rep(`    db=firebase.firestore();
    db.collection('keos')`,
`    db=firebase.firestore();
    db.collection('verifications').onSnapshot(s=>{CLOUD_VERIFIED={};s.forEach(d=>{CLOUD_VERIFIED[d.id]=d.data()||{};});if(MODE==='cloud')renderAll();});
    db.collection('kyc').onSnapshot(s=>{KYC_C=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(aTab==='kyc')renderAdminBody();updateKycBanner();});
    db.collection('keos')`, 'initCloud snapshots');

/* 2. kycOverlay const (dùng trong click handler) */
rep(`\$('#kycClose').addEventListener('click',()=>{closeKyc();});`,
`const kycOverlay=\$('#kycOverlay');
\$('#kycClose').addEventListener('click',()=>{closeKyc();});`, 'kycOverlay const');

/* 3. Khôi phục Escape handler (bị mất trong các lần dồn mảnh) — đóng mọi lớp */
rep(`/* ================= ROUTING ================= */`,
`document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  const ov=\$('#overlay'),kycEl=\$('#kycOverlay'),ven=\$('#venueOverlay');
  if(ov&&!ov.classList.contains('hide'))closeModal();
  else if(kycEl&&!kycEl.classList.contains('hide'))closeKyc();
  else if(typeof venueOverlay!=='undefined'&&venueOverlay&&!venueOverlay.classList.contains('hide'))closeVenueModal();
  else if(!\$('#mappop').classList.contains('hide'))closeRadarPop();
});

/* ================= ROUTING ================= */`, 'escape handler');

/* 4. version */
rep(`KÈO ĐÊ — v0.8.1 "MOBILE UX"`, `KÈO ĐÊ — v0.9 "EMAIL ACCOUNTS + KYC CCCD"`, 'head version');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'patch v09 part2 OK');
process.exit(missing.length ? 1 : 0);
