import express from "express";
import bcrypt from "bcrypt"; // ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน
import db from "../../lib/db.js"; // เชื่อมต่อกับฐานข้อมูล MySQL

const router = express.Router();

router.post("/login", async (req, res) => {
  const { user_id } = req.query; // ดึง user_id จาก query string
  const { password } = req.body; // ดึง password จาก body

  if (!user_id || !password) {
    return res
      .status(400)
      .json({ message: "User ID and password are required" });
  }

  try {
    // ค้นหาผู้ใช้โดยใช้ user_id ที่มาจาก query string
    const result = await db.query("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);

    if (result.length > 0) {
      const user = result[0]; // ดึงข้อมูล user ที่ตรงกับ user_id

      // เปรียบเทียบ password ที่กรอกกับที่เก็บในฐานข้อมูล
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        return res.status(200).json({
          message: "Login successful",
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
          },
        });
      } else {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
