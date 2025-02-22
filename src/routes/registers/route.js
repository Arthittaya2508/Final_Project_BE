import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js";

const router = express.Router();

// Register a new user
router.post("/", async (req, res) => {
  try {
    const { name, lastname, telephone, email, username, password, image } = req.body;

    const userQuery = `
      INSERT INTO users (name, lastname, telephone, email, username, password, image) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Run the query and get the result
    const [userResult] = await db.query(userQuery, [
      name,
      lastname,
      telephone,
      email,
      username,
      password,
      image,
    ]);

    // Cast userResult to any to bypass TypeScript error
    const userId = userResult.insertId;

    res.json({ success: true, userId });
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

export default router;
