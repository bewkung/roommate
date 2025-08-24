// const express = require("express");
// const session = require("express-session");
// const flash = require("connect-flash");
// const path = require("path");
// const multer = require("multer");
// const bcrypt = require("bcryptjs");
// const db = require("./config/database");
// const cloudinary = require("./config/cloudinary");
// const app = express();
// const upload = require("./middleware/upload");

// /// test
// const authRoutes = require("./routes/authRoutes");

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json()); // parse JSON
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.set("trust proxy", 1);

// app.use(
//   session({
//     secret: "secret_key_very_secret",
//     resave: false, // ไม่บันทึกซ้ำถ้าไม่มีการเปลี่ยน
//     saveUninitialized: false, // ไม่สร้าง session ว่าง
//     cookie: { secure: false }
//   })
// );
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.session = req.session;
//   res.locals.validationErrors = req.flash("validationErrors");
//   next();
// });

// app.use(authRoutes);
// // http://localhost:3000/login

// app.get("/", (req, res) => {
//   res.render("index");
// });

// app.get("/home", (req, res) => {
//   res.render("home");
// });

// app.get("/login", (req, res) => {
//   res.render("login");
// });

// app.get("/register", (req, res) => {
//   const errors = req.flash("validationErrors") || [];
//   res.render("register", { errors });
// });

// app.get("/post-room", (req, res) => {
//   res.render("post-room");
// });

// app.get("/edit-profile", async (req, res) => {
//   const Register_id = req.session.user?.Register_id;

//   if (!Register_id) {
//     return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");
//   }
//   try {
//     const [rows] = await db.execute(
//       "SELECT * FROM Accounts WHERE Register_id = ? LIMIT 1",
//       [Register_id]
//     );
//     if (rows.length === 0) {
//       // ถ้ายังไม่มีข้อมูลบัญชี อาจจะ redirect ไปหน้าเพิ่มข้อมูล
//       return res.redirect("/accounts");
//     }
//     const userData = rows[0];
//     // ส่ง userData ไปที่ template
//     res.render("edit-profile", { userData });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("เกิดข้อผิดพลาดในการโหลดข้อมูล");
//   }
// });

// app.get("/accounts", async (req, res) => {
//   const Register_id = req.session.user?.Register_id;

//   if (!Register_id) {
//     return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");
//   }

//   try {
//     const [rows] = await db.execute(
//       `SELECT * FROM Accounts WHERE Register_id = ? LIMIT 1`,
//       [Register_id]
//     );

//     if (rows.length > 0) {
//       // ถ้ามีข้อมูลแล้ว → ไปหน้าโปรไฟล์
//       return res.redirect("/profile");
//     }

//     // ถ้ายังไม่มีข้อมูล → แสดงหน้าเพิ่มข้อมูล
//     return res.render("accounts", { userData: null });
//   } catch (err) {
//     console.error("Error checking existing account:", err);
//     return res.status(500).send("เกิดข้อผิดพลาดในการโหลดข้อมูล");
//   }
// });

// //หน้าแสดงโปร์ไฟล์
// app.get("/profile", async (req, res) => {
//   const Register_id = req.session.user?.Register_id;

//   if (!Register_id) {
//     return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");
//   }

//   try {
//     const [rows] = await db.execute(
//     `SELECT
//       a.*,
//       f.faculty_name,
//       m.majors_name,
//       GROUP_CONCAT(p.description SEPARATOR ', ') AS description
//       FROM Accounts a
//       LEFT JOIN Faculty f ON a.Faculty_id = f.faculty_id
//       LEFT JOIN Majors m ON a.Majors_id = m.majors_id
//       LEFT JOIN Accounts_has_Personality ap ON a.Accounts_id = ap.Accounts_id
//       LEFT JOIN Personality p ON ap.Personality_id = p.Personality_id
//       WHERE a.Register_id = ?
//       GROUP BY a.Accounts_id
//       LIMIT 1
//     `,
//       [Register_id]
//     );

//     if (rows.length === 0) {
//       return res.redirect("/accounts"); // ไม่พบข้อมูล → ให้กลับไปเพิ่ม
//     }

//     const userData = rows[0];
//     res.render("profile", { userData });
//   } catch (err) {
//     console.error("Error loading profile:", err);
//     res.status(500).send("เกิดข้อผิดพลาดในการโหลดข้อมูล");
//   }
// });

// // Register
// app.post("/register", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const [rows] = await db.execute("SELECT * FROM Register WHERE email = ?", [
//       email,
//     ]);
//     if (rows.length > 0) {
//       req.flash("validationErrors", ["อีเมลนี้ถูกใช้ไปแล้ว"]);
//       return res.redirect("/register");
//     }

//     const hash = await bcrypt.hash(password, 10);
//     const regisDate = new Date();

//     await db.execute(
//       "INSERT INTO Register (email, password, regis_date) VALUES (?, ?, ?)",
//       [email, hash, regisDate]
//     );

//     res.redirect("/login");
//   } catch (error) {
//     console.error("Registration error:", error);
//     req.flash("validationErrors", ["เกิดข้อผิดพลาดในการลงทะเบียน"]);
//     res.redirect("/register");
//   }
// });

// // Logout
// app.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).send("Logout Error");
//     res.clearCookie("connect.sid");
//     res.redirect("/");
//   });
// });

// //เพิ่มข้อมูลผู้ใช้
// app.post("/accounts", upload.single("image"), async (req, res) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       nickname,
//       student_id,
//       age,
//       year,
//       phone,
//       gender,
//       Faculty_id,
//       Majors_id,
//       status,
//       Personality_id,
//     } = req.body;

//     const Register_id = req.session.user?.Register_id;

//     if (!Register_id) {
//       return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");
//     }

//     if (!req.file) {
//       return res.status(400).json({ message: "ไม่เจอไฟล์" });
//     }

//     const fileBuffer = req.file.buffer;
//     const base64Image = fileBuffer.toString("base64");
//     const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

//     const result = await cloudinary.uploader.upload(dataUri, {
//       public_id: `Student-${Date.now()}`,
//       resource_type: "image",
//       folder: "Student-images",
//     });

//     const secure_url = result.secure_url;
//     console.log("อัพโหลดสำเร็จ:", secure_url);

//     //  Insert Accounts
//     const [query] = await db.execute(
//       `INSERT INTO Accounts
//         (first_name, last_name, nickname, age, phone, status, gender, student_id, year, image, Register_id, Faculty_id, Majors_id)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [
//         first_name || null,
//         last_name || null,
//         nickname || null,
//         age || null,
//         phone || null,
//         status || null,
//         gender || null,
//         student_id || null,
//         year || null,
//         secure_url,
//         Register_id,
//         Faculty_id,
//         Majors_id,
//       ]
//     );
//     const Accounts_id = query.insertId;

//     //  ถ้าเลือก personality ให้ insert ลง Accounts_has_Personality
//     if (Personality_id) {
//       await db.execute(
//         `INSERT INTO Accounts_has_Personality (Accounts_id, Personality_id) VALUES (?, ?)`,
//         [Accounts_id, Personality_id]
//       );
//     }

//     return res.redirect("/profile"); //  ไปหน้าโปรไฟล์
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "เกิดข้อผิดพลาด",
//       error: error.message,
//     });
//   }
// });

// //แก้ไขโปรไฟล์
// app.post("/update/accounts", upload.single("image"), async (req, res) => {
//   const Register_id = req.session.user?.Register_id;
//   if (!Register_id) return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");

//   const { first_name, last_name, nickname, phone } = req.body;

//   try {
//     // ถ้ามีการอัปโหลดไฟล์ใหม่

//     const fileBuffer = req.file.buffer;
//     const base64Image = fileBuffer.toString("base64");
//     const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

//     const result = await cloudinary.uploader.upload(dataUri, {
//       public_id: `Student-${Date.now()}`,
//       resource_type: "image",
//       folder: "Student-images",
//     });

//     const public_id = result.public_id;
//     const secure_url = result.secure_url;

//     console.log("อัพโหลดสำเร็จ:", secure_url);
//     // update DB (ถ้ามีไฟล์ใหม่ให้เปลี่ยน, ถ้าไม่มีให้ใช้ค่าเดิม)
//     const response = await db.execute(
//       `UPDATE Accounts
//     SET first_name = ?, last_name = ?, nickname = ?, phone = ?, image = ?
//         WHERE Register_id = ? `,
//       [first_name, last_name, nickname, phone, secure_url, Register_id]
//     );
//     if (response) {
//       res.redirect("/profile");
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("บันทึกข้อมูลล้มเหลว");
//   }
// });

// //เพิ่มข้อมูลห้องผู้ใช้
// app.post("/room", upload.single("profileImage"), async (req, res) => {
//   const { room_name, room_description, Max_quantity, quantity } = req.body;

//   const image_room = req.file ? "/images/" + req.file.filename : null;
//   const email = req.session.user?.email;

//   try {
//     await db.execute(
//       `INSERT INTO Room
//         (room_name, room_description, Max_quantity, quantity, image_room)
//         VALUES (?, ?, ?, ?, ?)`,
//       [
//         room_name || null,
//         room_description || null,
//         Max_quantity || null,
//         quantity || null,
//         image_room,
//       ]
//     );

//     res.redirect("/home");
//   } catch (error) {
//     console.error("Error saving room:", error);
//     res.status(500).send("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
//   }
// });

// // Server
// app.listen(3000, () => {
//   console.log("Server running on port 3000");
// });

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const app = express();

const authRoutes = require("./routes/authRoutes");
const accountRoutes = require("./routes/accountRoutes");


// Middleware พื้นฐาน
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

// Session
app.use(session({
  secret: "secret_roommate",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(flash());

// Global variables สำหรับ ejs
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.validationErrors = req.flash("validationErrors");
  next();
});

// Routes
app.use("/", authRoutes);
app.use("/", accountRoutes);


// app.use("/room", roomRoutes);

// Pages (view only)
app.get("/", (req, res) => res.render("index"));
app.get("/home", (req, res) => res.render("home"));



app.listen(3000, () => console.log("Server running on port 3000"));
