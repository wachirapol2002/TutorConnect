const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require("path");
const dotenv = require('dotenv');
dotenv.config();  // ใช้ dotenv เพื่อโหลดไฟล์ .env

const app = express();
const port = process.env.PORT || 3000;


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

app.use(indexRouter.router)
app.use(accountRouter.router)
app.use(studentRouter.router)
app.use(tutorRouter.router)


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});