// Sửa cú pháp hỏng trong toggleJoin: try phải có catch, else-if đặt đúng chỗ.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const missing = [];
function rep(a, b, label) {
  if (!h.includes(a)) { missing.push(label || a.slice(0, 50)); return; }
  h = h.replace(a, () => b);
}

/* 1. nhánh huỷ */
rep(`    if(db){try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}
      else if(!fbValid(FB)){p.joined.splice(i,1);save('keode.posts.v2',KEO);}
      else{toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;}
    }
    toast('Đã huỷ yêu cầu tham gia.');`,
`    if(db){
      try{await db.collection('keos').doc(String(id)).update({joined:p.joined.filter((_,idx)=>idx!==i)});p.joined=p.joined.filter((_,idx)=>idx!==i);}
      catch(e){toast('Lỗi cloud: '+e.message);return;}
    }else if(!fbValid(FB)){
      p.joined.splice(i,1);save('keode.posts.v2',KEO);
    }else{
      toast('⚠️ Chưa kết nối được cloud — thử lại nhé!');return;
    }
    toast('Đã huỷ yêu cầu tham gia.');`, 'cancel syntax');

/* 2. nhánh tham gia */
rep(`    if(db){try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];}
      else if(!fbValid(FB)){p.joined.push(member);save('keode.posts.v2',KEO);}
      else{toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');return;}
    }
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');`,
`    if(db){
      try{await db.collection('keos').doc(String(id)).update({joined:[...p.joined,member]});p.joined=[...p.joined,member];}
      catch(e){toast('Lỗi cloud: '+e.message);return;}
    }else if(!fbValid(FB)){
      p.joined.push(member);save('keode.posts.v2',KEO);
    }else{
      toast('⚠️ Chưa kết nối được cloud — đợi vài giây rồi thử lại nhé!');return;
    }
    toast('Đã xin tham gia! Chờ chủ kèo duyệt nhé.');`, 'join syntax');

fs.writeFileSync('keo-de.html', h);
console.log(missing.length ? 'MISSING: ' + missing.join(' | ') : 'syntax fixed');
process.exit(missing.length ? 1 : 0);
