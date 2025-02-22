import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js";

const router = express.Router();


// Fetch all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Register a new user
router.post("/", async (req, res) => {
  const connection = await db.getConnection(); // Get connection for transaction

  try {
    const data = req.body; // Access the request body
    const { name, lastname, telephone, email, username, password, image } = data;

    await connection.beginTransaction(); // Start transaction

    // Insert user data
    const [userResult] = await connection.query(
      `INSERT INTO users (name, lastname, telephone, email, username, password, image)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, telephone, email, username, password, image]
    );

    const user_id = userResult.insertId; // Get the inserted user ID

    await connection.commit(); // Commit transaction

    res.json({ success: true, user_id });
  } catch (error) {
    await connection.rollback(); // Rollback transaction in case of error
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Failed to register user" });
  } finally {
    connection.release(); // Release connection
  }
});

// Update user information
router.put("/", async (req, res) => {
  const connection = await db.getConnection(); // Get connection for transaction

  try {
    const data = req.body;
    const { user_id, name, lastname, telephone, email, username, password, image } = data;

    await connection.beginTransaction(); // Start transaction

    // Update user data
    await connection.query(
      `UPDATE users SET name = ?, lastname = ?, telephone = ?, email = ?, username = ?, password = ?, image = ? WHERE id = ?`,
      [name, lastname, telephone, email, username, password, image, user_id]
    );

    await connection.commit(); // Commit transaction

    res.json({ success: true });
  } catch (error) {
    await connection.rollback(); // Rollback transaction in case of error
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  } finally {
    connection.release(); // Release connection
  }
});

// Delete user
router.delete("/", async (req, res) => {
  const connection = await db.getConnection(); // Get connection for transaction

  try {
    const { user_id } = req.body;

    await connection.beginTransaction(); // Start transaction

    // Delete user data
    await connection.query(`DELETE FROM users WHERE id = ?`, [user_id]);

    await connection.commit(); // Commit transaction

    res.json({ success: true });
  } catch (error) {
    await connection.rollback(); // Rollback transaction in case of error
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  } finally {
    connection.release(); // Release connection
  }
});

export default router;
