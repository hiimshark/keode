// Fix: String.replace ăn mất "$$" — dùng replacer function để thay literal.
const fs = require('fs');
let h = fs.readFileSync('keo-de.html', 'utf8');

// 1. vibes: $$( → $$(  (bản đang lỗi là $( )
const brokenVibes = "  const vibes=$('#vibeChips input:checked').map(i=>i.value);";
const okVibes = "  const vibes=$$('#vibeChips input:checked').map(i=>i.value);";
if (h.includes(brokenVibes)) { h = h.replace(brokenVibes, () => okVibes); console.log('vibes $$ OK'); }
else if (h.includes(okVibes)) { console.log('vibes already OK'); }

// 2. ptab forEach bị nuốt $$ thành $ — khôi phục
const brokenTab = "$('.ptab').forEach(b=>b.classList.toggle('on',b.dataset.pt===policyTab));";
const okTab = "$$('.ptab').forEach(b=>b.classList.toggle('on',b.dataset.pt===policyTab));";
if (h.includes(brokenTab)) { h = h.replace(brokenTab, () => okTab); console.log('ptab $$ OK'); }
else if (h.includes(okTab)) { console.log('ptab already OK'); }

fs.writeFileSync('keo-de.html', h);

// 3. Quét các chỗ PATCH-IN có thể bị nuốt $$ khác (chỉ báo cáo)
const suspicious = ['$("#phSend")', "$('.ptab')"];
suspicious.forEach(s => console.log('check', s, '→', h.includes(s) ? 'CÓ (kiểm tra)' : 'không có'));
