const Account = require("../models/AccountModel");
const HomeModel = require("../models/HomeModel");

exports.getHome = async (req, res) => {
  try {
    const Register_id = req.session.user?.Register_id;
    if (!Register_id) return res.redirect("/login");

    // ข้อมูลของตัวเอง
    const account = await Account.findByRegisterId(Register_id);

    if (!account) {
      return res.redirect("/accounts");
    }

    // ดึงผู้ใช้ทั้งหมด
    const accounts = await HomeModel.getAllUsers();
    // res.send(accounts)
    res.render("home", { accounts, userData: account });
  } catch (err) {
    console.error("Get home error:", err);
    res.status(500).send("โหลดหน้า Home ล้มเหลว");
  }
};




