const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

const Account = {
  // ดึงข้อมูลโปรไฟล์จาก Register_id
  findByRegisterId: async (Register_id) => {
    const [rows] = await pool.execute(
      `SELECT 
        a.*, 
        f.faculty_name, 
        m.majors_name,
        GROUP_CONCAT(p.description SEPARATOR ', ') AS personalities
      FROM Accounts a
      LEFT JOIN Faculty f ON a.Faculty_id = f.faculty_id
      LEFT JOIN Majors m ON a.Majors_id = m.majors_id
      LEFT JOIN Accounts_has_Personality ap ON a.Accounts_id = ap.Accounts_id
      LEFT JOIN Personality p ON ap.Personality_id = p.Personality_id
      WHERE a.Register_id = ?
      GROUP BY a.Accounts_id
      LIMIT 1`,
      [Register_id]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const { Register_id, name, age, Faculty_id, Majors_id, image } = data;
    const [result] = await pool.execute(
      `INSERT INTO Accounts (Register_id, name, age, Faculty_id, Majors_id, image) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [Register_id, name, age, Faculty_id, Majors_id, image]
    );
    return result.insertId;
  },

  update: async (Accounts_id, data) => {
    const { name, age, Faculty_id, Majors_id, image } = data;
    await pool.execute(
      `UPDATE Accounts SET name=?, age=?, Faculty_id=?, Majors_id=?, image=? WHERE Accounts_id=?`,
      [name, age, Faculty_id, Majors_id, image, Accounts_id]
    );
    return true;
  }
};

module.exports = Account;


