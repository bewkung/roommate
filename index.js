const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const db = require('./config/database');

const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.validationErrors = req.flash('validationErrors');
  next();
});


// กำหนด storage และ path เก็บไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/'); // โฟลเดอร์เก็บรูปภาพ
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage: storage });


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
  const errors = req.flash('validationErrors') || [];
  res.render('register', { errors });
});

app.get('/accounts', (req, res) => {
  res.render('accounts');
});


// Register
app.post('/user/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM Register WHERE email = ?', [email]);
    if (rows.length > 0) {
      req.flash('validationErrors', ['อีเมลนี้ถูกใช้ไปแล้ว']);
      return res.redirect('/register');
    }

    const hash = await bcrypt.hash(password, 10);
    const regisDate = new Date();

    await db.execute(
      'INSERT INTO Register (email, password, regis_date) VALUES (?, ?, ?)',
      [email, hash, regisDate]
    );

    res.redirect('/login');
  } catch (error) {
    console.error('Registration error:', error);
    req.flash('validationErrors', ['เกิดข้อผิดพลาดในการลงทะเบียน']);
    res.redirect('/register');
  }
});

// Login
app.post('/user/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.execute('SELECT * FROM Register WHERE email = ?', [email]);
    if (rows.length > 0 && await bcrypt.compare(password, rows[0].password)) {
      req.session.user = rows[0];
      console.log(rows[0]);
      return res.redirect('/home');
    }
    req.flash('validationErrors', ['อีเมลหรือรหัสผ่านไม่ถูกต้อง']);
    res.redirect('/login');
  } catch (error) {
    req.flash('validationErrors', ['เกิดข้อผิดพลาดในการตรวจสอบข้อมูล']);
    res.redirect('/login');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout Error');
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

app.post('/accounts', upload.single('profileImage'), async (req, res) => {
  const {
    first_name,
    last_name,
    nickname,
    student_id,
    age,
    year,
    phone,
    gender,
    Faculty_id,
    Majors_id,
    status
  } = req.body;

  const image = req.file ? '/images/' + req.file.filename : null;
  const Register_id = req.session.user?.Register_id;

  if (!Register_id) {
    return res.status(401).send('กรุณาเข้าสู่ระบบก่อน');
  }

  try {
    await db.execute(
      `INSERT INTO Accounts 
        (first_name, last_name, nickname, age, phone, status, gender, student_id, year, image, Register_id, Faculty_id, Majors_id) 
        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        first_name || null,
        last_name || null,
        nickname || null,
        age || null,
        phone || null,
        status || null,
        gender || null,
        student_id || null,
        year || null,
        image,
        Register_id,
        Faculty_id,
        Majors_id
      ]
    );

    res.redirect('/home');
  } catch (error) {
    console.error('Error saving account:', error);
    res.status(500).send('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
  }
});




// Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});