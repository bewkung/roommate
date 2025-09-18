const express = require("express");
const router = express.Router();
const {isAuthenticated} = require("../middleware/authMiddleware");
const AuthController = require("../controllers/AuthController");

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);
router.get("/register", AuthController.showRegister);
router.post("/register", AuthController.register);
router.get("/logout", AuthController.logout);

module.exports = router;

