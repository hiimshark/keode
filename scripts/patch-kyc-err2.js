// Áp nốt: kyc admin snapshot bắt lỗi (anchor khớp file thật).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = "      db.collection('kyc').onSnapshot(s=>{KYC_C=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(aTab==='kyc')renderAdminBody();updateKycBanner();},()=>{});";
const b = "      db.collection('kyc').onSnapshot(s=>{KYC_ERR=null;KYC_C=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(aTab==='kyc')renderAdminBody();updateKycBanner();},e=>{KYC_ERR=e.code||e.message;if(aTab==='kyc')renderAdminBody();});";
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('kyc err capture OK');
