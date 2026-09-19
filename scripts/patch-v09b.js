// v0.9 part1-fix: banner KYC đặt trước searchbar.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');
const a = `      <div class="searchbar">
        <span class="sic">`;
const b = `      <div id="kycBanner" class="hide"></div>
      <div class="searchbar">
        <span class="sic">`;
if (h.includes(a)) { h = h.replace(a, () => b); fs.writeFileSync('keo-de.html', h); console.log('kycBanner OK'); }
else if (h.includes('id="kycBanner"')) { console.log('already there'); }
else { console.log('anchor not found'); process.exit(1); }
