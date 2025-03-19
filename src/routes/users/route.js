import express from "express";
import db from "../../lib/db.js";
import bcrypt from "bcrypt"; // ใช้ bcrypt สำหรับการเข้ารหัสรหัสผ่าน

const router = express.Router();

// Fetch all users
router.get("/user", async (req, res) => {
  const { user_id } = req.query; // ดึง user_id จาก query string

  if (!user_id) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]); // ส่งข้อมูลผู้ใช้ที่พบ
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Register a new user
router.post("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const data = req.body;
    console.log("Received Data:", data);

    // ตรวจสอบว่ามีค่าหรือไม่
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    const { name, lastname, telephone, email, username, password, image } =
      data;

    // ตรวจสอบว่าข้อมูลสำคัญมีค่าครบถ้วนหรือไม่
    if (!name || !lastname || !telephone || !email || !username || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.beginTransaction();

    // Insert user data
    const [userResult] = await connection.query(
      `INSERT INTO users (name, lastname, telephone, email, username, password, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, telephone, email, username, hashedPassword, image]
    );

    const user_id = userResult.insertId;

    await connection.commit();

    res.json({ success: true, user_id });
  } catch (error) {
    await connection.rollback();
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Failed to register user" });
  } finally {
    connection.release();
  }
});

// Update user information
router.put("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const data = req.body;
    console.log("Update Data:", data);

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: "Request body is empty" });
    }

    const {
      user_id,
      name,
      lastname,
      telephone,
      email,
      username,
      password,
      image,
    } = data;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // ตรวจสอบรูปแบบอีเมล
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    await connection.beginTransaction();

    // ถ้ารหัสผ่านถูกส่งมาให้เข้ารหัสใหม่
    let query = `UPDATE users SET name = ?, lastname = ?, telephone = ?, email = ?, username = ?, image = ? WHERE id = ?`;
    let values = [name, lastname, telephone, email, username, image, user_id];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = `UPDATE users SET name = ?, lastname = ?, telephone = ?, email = ?, username = ?, password = ?, image = ? WHERE id = ?`;
      values = [
        name,
        lastname,
        telephone,
        email,
        username,
        hashedPassword,
        image,
        user_id,
      ];
    }

    await connection.query(query, values);

    await connection.commit();

    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  } finally {
    connection.release();
  }
});

// Delete user
router.delete("/", async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    await connection.beginTransaction();

    await connection.query(`DELETE FROM users WHERE id = ?`, [user_id]);

    await connection.commit();

    res.json({ success: true });
  } catch (error) {
    await connection.rollback();
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  } finally {
    connection.release();
  }
});

export default router;
