const pool = require("../config/database");
const cloudinary = require("../config/cloudinary");

class HomeModel {
  static async getAllUsers() {
    const [rows] = await pool.execute(
      `SELECT 
          a.*, 
          f.faculty_name, 
          m.majors_name,
          GROUP_CONCAT(p.description SEPARATOR ', ') AS Personality
       FROM Accounts a
       LEFT JOIN Faculty f ON a.Faculty_id = f.Faculty_id
       LEFT JOIN Majors m ON a.Majors_id = m.Majors_id
       LEFT JOIN Accounts_has_Personality ap ON a.Accounts_id = ap.Accounts_id
       LEFT JOIN Personality p ON ap.Personality_id = p.Personality_id
       GROUP BY a.Accounts_id`
    );
    return rows;
  }
}

module.exports = HomeModel;
