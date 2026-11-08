// Máy chủ ghép trận: phục vụ public/index.html và chuyển tiếp tin nhắn giữa 2 người chơi.
const http = require('http'), fs = require('fs'), path = require('path');
const { WebSocketServer } = require('ws');
const PORT = process.env.PORT || 3000;
const CHARS = ['kiemsi', 'maphap', 'cungthu'];

const server = http.createServer((req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, data) => {
    res.writeHead(err ? 500 : 200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(err ? 'Server error' : data);
  });
});
const wss = new WebSocketServer({ server });
let waiting = null;
const send = (w, o) => { if (w && w.readyState === 1) w.send(JSON.stringify(o)); };
const clean = m => ({
  name: String(m.name || 'Player').slice(0, 14),
  ch: CHARS.includes(m.ch) ? m.ch : 'kiemsi',
  lv: Math.min(99, Math.max(1, parseInt(m.lv) || 1))
});

wss.on('connection', ws => {
  ws.on('message', raw => {
    let m; try { m = JSON.parse(raw); } catch { return; }
    if (m.t === 'queue') {
      ws.info = clean(m);
      if (waiting && waiting !== ws && waiting.readyState === 1) {
        const a = waiting; waiting = null;
        a.peer = ws; ws.peer = a;
        send(a, { t: 'match', op: ws.info });
        send(ws, { t: 'match', op: a.info });
      } else waiting = ws;
    } else if (ws.peer) {
      if (m.t === 'hit') send(ws.peer, { t: 'hit', d: Math.min(400, Math.max(0, Number(m.d) || 0)) });
      else if (m.t === 'win' || m.t === 'lose') send(ws.peer, { t: m.t });
    }
  });
  ws.on('close', () => {
    if (waiting === ws) waiting = null;
    if (ws.peer) { send(ws.peer, { t: 'left' }); ws.peer.peer = null; }
  });
});
server.listen(PORT, () => console.log('Candy Rank chạy tại http://localhost:' + PORT));
