const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");
const pool = require("../config/database");
const AccountController = require("../controllers/AccountsController");



// router.get("/accounts", AccountController.getAccount);
router.get("/accounts",AccountController.getAccount ); 
router.post("/accounts",upload.single("image"),AccountController.createAccount ); 



// ---------------- Profile Management ----------------
// แสดงโปรไฟล์ของผู้ใช้ที่ล็อกอิน
router.get("/profile", AccountController.getProfile);
// ฟอร์มแก้ไขโปรไฟล์
router.get("/profile/edit",upload.single("image"), AccountController.showEditProfile);
// อัพเดทโปรไฟล์
router.post("/profile/update", upload.single("image"), AccountController.updateProfile);

module.exports = router;
