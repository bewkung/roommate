const pool = require("../config/database");
const bcrypt = require("bcryptjs");

class Register {
  static async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM Register WHERE email = ?", [email]);
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(email, password) {
    const hash = await bcrypt.hash(password, 10);
    const regisDate = new Date();
    await pool.execute(
      "INSERT INTO Register (email, password, regis_date) VALUES (?, ?, ?)",
      [email, hash, regisDate]
    );
  }

  static async checklogin(email, password) {
    const [rows] = await pool.execute("SELECT * FROM Register WHERE email = ?", [email]);
    if (rows.length === 0) return null;

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }
}

module.exports = Register;

