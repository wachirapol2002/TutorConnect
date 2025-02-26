const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require("path");
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();  // ใช้ dotenv เพื่อโหลดไฟล์ .env

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);
// socket.io เชื่อมต่อกับเซิร์ฟเวอร์
const io = socketIo(server, {
  cors: {
    origin: "*",  // อนุญาตให้ทุกโดเมน
    methods: ["GET", "POST"],
  }
});

// ใช้ middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
  maxAge:  3600 * 1000 // 1hr
}));

// routers
const indexRouter = require('./routes/index')
const accountRouter = require('./routes/account')
const studentRouter = require('./routes/student')
const tutorRouter = require('./routes/tutor')
const adminRouter = require('./routes/admin')

app.use(indexRouter.router)
app.use(accountRouter.router)
app.use(studentRouter.router)
app.use(tutorRouter.router)
app.use(adminRouter.router)


io.on("connection", (socket) => {
  console.log(`🔥 User connected: ${socket.id}`);



  // เมื่อมีการเข้าห้องแชท
  socket.on("joinRoom", ({ user1, user2 }) => {
    const roomID = [user1, user2].sort().join("_"); // สร้าง ID ห้องจากผู้ใช้ทั้งสอง
    socket.join(roomID);
    console.log(`📢 ${user1} joined room: ${roomID}`);

  });

  // รับข้อความและส่งต่อไปห้องที่กำหนด
  socket.on("sendMessage", ({ sender, receiver, message }) => {
    const roomID = [sender, receiver].sort().join("_");
    console.log(`📩 Message from ${sender} to ${receiver}: ${message}`);
    console.log(roomID)
    

    io.to(roomID).emit("receiveMessage", { sender, receiver, message });
  });

  // เมื่อผู้ใช้ตัดการเชื่อมต่อ
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});