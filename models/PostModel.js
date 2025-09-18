const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

class PostModel {
  // หาข้อมูลโพสต์ของ user
  static async getPostByUser(Register_id) {
    const [rows] = await pool.execute(
      `SELECT 
        a.*, 
        f.faculty_name, 
        m.majors_name,
        GROUP_CONCAT(p.description SEPARATOR ', ') AS Personalitiy
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
  }

  // สร้างโพสต์ใหม่
  static async createPost(Accounts_id, content, status) {
    const [check] = await pool.execute(
      "SELECT * FROM Posts WHERE Accounts_id = ?",
      [Accounts_id]
    );

    if (check.length > 0) {
      throw new Error("User already has a post");
    }

    // ถ้ามีห้อง (has_room) → เก็บ content
    // ถ้าไม่มีห้อง (no_room) → content = NULL
    const postContent = status === "มีห้องแล้ว" ? content : null;

    await pool.execute(
      "INSERT INTO Post (Accounts_id, content, created_at) VALUES (?, ?, NOW())",
      [Accounts_id, postContent]
    );
  }
}


module.exports = PostModel;
