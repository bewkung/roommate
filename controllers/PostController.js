const PostModel = require("../models/PostModel");
const Account = require("../models/AccountModel");

exports.showMyPost = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.redirect("/login");

    const post = await PostModel.getPostByUser(Register_id);

    if (!post) {
      // ยังไม่มีโพสต์ → ให้ไปสร้าง
      return res.redirect("/post/create");
    }

    res.render("my-post", { post });
  } catch (err) {
    console.error("Show my post error:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.showCreatePost = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.redirect("/login");

    const account = await Account.findByRegisterId(Register_id);
    if (!account) return res.redirect("/accounts");

    res.render("create-post", { account });
  } catch (err) {
    console.error("Show create post error:", err);
    res.status(500).send("Internal Server Error");
  }
};

exports.storePost = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.redirect("/login");

    const account = await Account.findByRegisterId(Register_id);
    if (!account) return res.redirect("/accounts");

    // ส่ง status ไปด้วย (has_room / no_room)
    await PostModel.createPost(account.Accounts_id, req.body.content, account.status);

    res.redirect("/post");
  } catch (err) {
    console.error("Store post error:", err.message);
    if (err.message === "User already has a post") {
      return res.redirect("/post");
    }
    res.status(500).send("Internal Server Error");
  }
};


