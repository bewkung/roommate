const cloudinary = require("../config/cloudinary");
const Account = require("../models/AccountModel");
const pool = require("../config/database");

//แสดงผู้ใช้ถ้ามีข้อมูลแล้วให้ไปแสดงหน้า profile
exports.getAccount = async (req, res) => {
  const Register_id = req.session.user?.Register_id;
  if (!Register_id) {
    return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");
  }
  try {
    const [rows] = await pool.execute(
      `SELECT * FROM Accounts WHERE Register_id = ? LIMIT 1`,
      [Register_id]
    );
    if (rows.length > 0) {
      // ถ้ามีข้อมูลแล้ว → ไปหน้าโปรไฟล์
      return res.redirect("/profile");
    }
    // ถ้ายังไม่มีข้อมูล → แสดงหน้าเพิ่มข้อมูล
    return res.render("accounts", { userData: null });
  } catch (err) {
    console.error("Error checking existing account:", err);
    return res.status(500).send("เกิดข้อผิดพลาดในการโหลดข้อมูล");
  }
};



// เพิ่มข้อมูลผู้ใช้
exports.createAccount = async (req, res) => {
  try {
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
      status,
      Personality_id,
    } = req.body;

    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");

    if (!req.file) {
      return res.status(400).json({ message: "ไม่เจอไฟล์" });
    }

    // อัพโหลดรูป
    const fileBuffer = req.file.buffer;
    const base64Image = fileBuffer.toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      public_id: `Student-${Date.now()}`,
      resource_type: "image",
      folder: "Student-images",
    });

    const secure_url = result.secure_url;

    // insert Accounts
    const [query] = await pool.execute(
      `INSERT INTO Accounts
        (first_name, last_name, nickname, age, phone, status, gender, student_id, year, image, Register_id, Faculty_id, Majors_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        secure_url,
        Register_id,
        Faculty_id,
        Majors_id,
      ]
    );
    const Accounts_id = query.insertId;

    // personality
    if (Personality_id) {
      await pool.execute(
        `INSERT INTO Accounts_has_Personality (Accounts_id, Personality_id) VALUES (?, ?)`,
        [Accounts_id, Personality_id]
      );
    }

    return res.redirect("/profile");
  } catch (error) {
    console.error("Create account error:", error);
    return res.status(500).json({
      message: "เกิดข้อผิดพลาด",
      error: error.message,
    });
  }
};




// ---------------- Profile ----------------
exports.getProfile = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) {
      return res.redirect("/login");
    }

    const account = await Account.findByRegisterId(Register_id);

    if (!account) {
      return res.redirect("/accounts"); // ยังไม่มีโปรไฟล์ → ไปสร้างใหม่
    }

    res.render("profile", { userData: account });
  } catch (err) {
    console.error("Get profile error:", err);
    res.status(500).send("เกิดข้อผิดพลาดในการโหลดโปรไฟล์");
  }
};

// ------------------ GET หน้าแก้ไขโปรไฟล์ ------------------
exports.showEditProfile = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.redirect("/login");

    const account = await Account.findByRegisterId(Register_id);

    if (!account) {
      // ยังไม่มี account → ให้ไปสร้างก่อน
      return res.redirect("/accounts");
    }

    res.render("edit-profile", { userData: account });
  } catch (err) {
    console.error("Show edit profile error:", err);
    res.status(500).send("Internal Server Error");
  }
};

// ------------------ POST อัพเดทโปรไฟล์ ------------------
exports.updateProfile = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.status(401).send("กรุณาเข้าสู่ระบบก่อน");

    const { first_name, last_name, nickname, phone } = req.body;
    let secure_url;

    // ถ้ามีการอัพโหลดไฟล์ใหม่
    if (req.file) {
      const fileBuffer = req.file.buffer;
      const base64Image = fileBuffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "Student-images",
        public_id: `Student-${Date.now()}`
      });

      secure_url = result.secure_url;
    }

    await pool.execute(
      `UPDATE Accounts 
       SET first_name=?, last_name=?, nickname=?, phone=?, image=COALESCE(?, image)
       WHERE Register_id=?`,
      [first_name, last_name, nickname, phone, secure_url, Register_id]
    );

    req.flash("success", "อัพเดทข้อมูลเรียบร้อยแล้ว");
    res.redirect("/profile");
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).send("บันทึกข้อมูลล้มเหลว");
  }
};



