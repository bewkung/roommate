const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const db = require('./config/database');
const bcrypt = require('bcryptjs');


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');  
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.render('index'); 
});

app.get('/home', (req, res) => {
  res.render('home'); 
});

app.get('/login', (req, res) => {
  res.render('login'); 
});

app.get('/register', (req, res) => {
  res.render('register'); 
});

app.get('/accounts', (req, res) => {
  res.render('accounts'); 
});

app.post('/user/login',  (req, res) => {
  const { email, password } = req.body;
  try {
    // ตรวจสอบว่าอีเมลมีในระบบหรือไม่
    const rows = db.query('SELECT * FROM register WHERE email = ?', [email]);

    if (rows.length === 0) {
      // ไม่พบผู้ใช้งาน
      return res.render('login', { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    const user = rows;
    // ตรวจสอบรหัสผ่าน (กรณีมีการเข้ารหัสไว้ด้วย bcrypt)
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('login', { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    // session
    req.session.userId = user.id;
    req.session.userEmail = user.email;

    // เข้าสู่ระบบสำเร็จ
    res.redirect('/accounts');
  } catch (error) {
    console.error(error);
    res.render('login', { error: 'เกิดข้อผิดพลาดในระบบ' });
  }
});



// Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});



