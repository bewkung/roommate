const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {isAuthenticated} = require("../middleware/authMiddleware");
const cloudinary = require("../config/cloudinary");
const AccountController = require("../controllers/AccountsController");



// router.get("/accounts", AccountController.getAccount);
router.get("/accounts",isAuthenticated,AccountController.getAccount ); 
router.post("/accounts",isAuthenticated,upload.single("image"),AccountController.createAccount ); 



// ---------------- Profile Management ----------------
// แสดงโปรไฟล์ของผู้ใช้ที่ล็อกอิน
router.get("/profile",isAuthenticated, AccountController.getProfile);
router.get("/edit-profile",isAuthenticated,upload.single("image"), AccountController.showEditProfile);
router.post("/update/accounts",isAuthenticated, upload.single("image"), AccountController.updateProfile);

module.exports = router;
