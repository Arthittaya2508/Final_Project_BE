import express from "express";
import db from "../../lib/db.js"; // เพิ่ม `.js` ที่ท้ายไฟล์

const router = express.Router();

// Fetch all genders
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM genders");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching genders:", error);
    res.status(500).json({ error: "Failed to fetch genders" });
  }
});

// Add a new gender
router.post("/", async (req, res) => {
  try {
    const { gender_name } = req.body; // รับข้อมูล gender_name จาก request body

    if (!gender_name) {
      return res.status(400).json({ error: "gender name is required" });
    }

    // Insert the new gender into the genders table
    const [result] = await db.query(
      "INSERT INTO genders (gender_name) VALUES (?)",
      [gender_name]
    );

    // Respond with the newly added gender's id and name
    res.status(201).json({ gender_id: result.insertId, gender_name });
  } catch (error) {
    console.error("Error adding gender:", error);
    res.status(500).json({ error: "Failed to add gender" });
  }
});

// Update an existing gender
router.put("/", async (req, res) => {
  try {
    const { gender_id, gender_name } = req.body;

    const [result] = await db.query(
      `UPDATE genders SET gender_name = ? WHERE gender_id = ?`,
      [gender_name, gender_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating gender:", error);
    res.status(500).json({ error: "Failed to update gender" });
  }
});

// Delete an existing gender
router.delete("/", async (req, res) => {
  try {
    const { gender_id } = req.body;

    const [result] = await db.query(`DELETE FROM genders WHERE gender_id = ?`, [
      gender_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting gender:", error);
    res.status(500).json({ error: "Failed to delete gender" });
  }
});

export default router;
