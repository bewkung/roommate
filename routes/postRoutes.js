const express = require("express");
const router = express.Router();
const PostController = require("../controllers/PostController");

router.get("/post", PostController.showMyPost);        
router.get("/post/create", PostController.showCreatePost); 
router.post("/post/create", PostController.storePost);

module.exports = router;