// Venues: tự đẩy bù các quán trên máy mà cloud chưa có (theo tên, admin mới đẩy được).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `    db.collection('venues').onSnapshot(s=>{
      if(!s.empty){
        PARTNERS=s.docs.map(d=>Object.assign({id:d.id},d.data()));
        renderPartnerStrip();renderVenues();
      }else if(!venueSeeded){
        venueSeeded=true;
        /* lần đầu: đẩy quán mẫu + quán đã tạo trên máy lên cloud (chỉ admin thành công) */
        PARTNERS.forEach(p=>{const{id,...data}=p;db.collection('venues').doc(String(p.id)).set(data).catch(()=>{});});
      }
    },()=>{});`;
const b = `    db.collection('venues').onSnapshot(s=>{
      const docs=s.docs.map(d=>Object.assign({id:d.id},d.data()));
      if(!s.empty){
        /* đẩy bù: quán có trên máy này mà cloud chưa có (theo tên) — admin đăng nhập mới đẩy được */
        const names=new Set(docs.map(d=>d.data().name));
        const extras=PARTNERS.filter(p=>p.name&&!names.has(p.name));
        if(extras.length&&firebase.auth()&&firebase.auth().currentUser){
          extras.forEach(p=>{const{id,...data}=p;db.collection('venues').doc(String(p.id)||('p'+Date.now())).set(data).catch(()=>{});});
        }
        PARTNERS=docs.concat(extras);
        renderPartnerStrip();renderVenues();
      }else if(!venueSeeded){
        venueSeeded=true;
        /* lần đầu: đẩy quán mẫu + quán đã tạo trên máy lên cloud (chỉ admin thành công) */
        PARTNERS.forEach(p=>{const{id,...data}=p;db.collection('venues').doc(String(p.id)).set(data).catch(()=>{});});
      }
    },()=>{});`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('venue merge OK');
