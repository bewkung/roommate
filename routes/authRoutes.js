// const express = require("express");
// const router = express.Router();
// const AuthController = require("../controllers/AuthController");

// router.post("/login", AuthController.login);


// module.exports = router;

const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.get("/login", AuthController.showLogin);
router.post("/login", AuthController.login);
router.get("/register", AuthController.showRegister);
router.post("/register", AuthController.register);
router.get("/logout", AuthController.logout);

module.exports = router;

