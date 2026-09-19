// Fix: luồng email đăng ký/đăng nhập thiếu await ensureFirebase().
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `  if(fbValid(FB)){
    try{
      let u;
      if(regIsLogin){u=(await firebase.auth().signInWithEmailAndPassword(email,pass)).user;}`;
const b = `  if(fbValid(FB)){
    try{
      await ensureFirebase();
      let u;
      if(regIsLogin){u=(await firebase.auth().signInWithEmailAndPassword(email,pass)).user;}`;
if (!h.includes(a)) { console.log('anchor not found'); process.exit(1); }
h = h.replace(a, () => b);
fs.writeFileSync('keo-de.html', h);
console.log('email ensureFirebase OK');
