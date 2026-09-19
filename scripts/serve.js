// Zero-dependency static server cho prototype KÈO ĐÊ.
// Chạy: node scripts/serve.js  (PORT env được hỗ trợ; tự nhảy cổng nếu bận)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
};

function start(port) {
  const server = http.createServer((req, res) => {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/keo-de.html'; // mở thẳng bản chính
    const file = path.normalize(path.join(ROOT, urlPath));
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); return res.end('404 Not Found: ' + urlPath); }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(data);
    });
  });
  server.on('error', e => {
    if (e.code === 'EADDRINUSE' && port < 8090) { console.log('Cổng ' + port + ' bận, thử ' + (port + 1) + '…'); start(port + 1); }
    else { console.error('Lỗi server:', e.message); process.exit(1); }
  });
  server.listen(port, '127.0.0.1', () => {
    console.log('KÈO ĐÊ prototype đang chạy tại http://localhost:' + port + '/keo-de.html');
  });
}
start(Number(process.env.PORT) || 8787);
