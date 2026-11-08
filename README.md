# Candy Rank Online

Game ghép 3 kiểu Candy Crush, đấu rank thời gian thực với người chơi thật (không có ai thì ghép với bot).

## Chạy thử
```bash
npm install
npm start
```
Mở http://localhost:3000 trên 2 tab hoặc 2 máy cùng mạng, bấm "Đấu rank" ở cả hai để ghép trận.

## Cho người khác chơi qua internet
Đẩy repo lên GitHub rồi deploy lên dịch vụ chạy Node.js có WebSocket (Render, Railway, Fly.io…). Lệnh build: `npm install`, lệnh chạy: `npm start`. GitHub Pages không chạy được server, nên không dùng cho phần online.

## Luật chơi
- Ghép 3 trở lên là đánh thường, ghép 4 x1.5, ghép 5 x2, mỗi lần ăn dây chuyền thêm 50%.
- Gem sở trường của nhân vật gây x1.5. Cung thủ có 20% chí mạng.
- Đấu thời gian thực: ai hết máu trước thì thua. Thắng +25 RP, thua -10 RP.
- Tiến trình lưu trong trình duyệt (localStorage).
