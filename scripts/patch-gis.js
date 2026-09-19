// Vá 1 lần: bọc GIS render trong try/catch với fallback (file:// sẽ rơi vào đây).
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `    loadScript('https://accounts.google.com/gsi/client').then(()=>{
      google.accounts.id.initialize({client_id:CONFIG.gcid,callback:onGoogleCredential,ux_mode:'popup',auto_select:false});
      gsi.innerHTML='';
      google.accounts.id.renderButton(gsi,{theme:'outline',size:'large',text:'continue_with',shape:'pill',locale:'vi',width:340});
    }).catch(()=>{gsi.classList.add('hide');gm.classList.remove('hide');toast('Google Sign-In chỉ chạy qua http://127.0.0.1:8787 (không chạy trên file://)');});`;
const b = `    loadScript('https://accounts.google.com/gsi/client').then(()=>{
      try{
        google.accounts.id.initialize({client_id:CONFIG.gcid,callback:onGoogleCredential,ux_mode:'popup',auto_select:false});
        gsi.innerHTML='';
        google.accounts.id.renderButton(gsi,{theme:'outline',size:'large',text:'continue_with',shape:'pill',locale:'vi',width:340});
      }catch(e){fallbackG();}
    }).catch(()=>fallbackG());
    function fallbackG(){gsi.classList.add('hide');gm.classList.remove('hide');toast('Google Sign-In chỉ chạy qua http://127.0.0.1:8787 (không chạy trên file://)');}`;
if (!h.includes(a)) { console.log('GIS BLOCK NOT FOUND'); process.exit(1); }
h = h.replace(a, b);
fs.writeFileSync('keo-de.html', h);
console.log('GIS try/catch ok');
