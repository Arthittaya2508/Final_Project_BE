import express from "express";
import db from "../../lib/db.js"; // เพิ่ม `.js` ที่ท้ายไฟล์

const router = express.Router();

// Fetch all colors
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM colors");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching colors:", error);
    res.status(500).json({ error: "Failed to fetch colors" });
  }
});

// Add a new color
router.post("/", async (req, res) => {
  try {
    const { color_name } = req.body; // รับข้อมูล color_name จาก request body

    if (!color_name) {
      return res.status(400).json({ error: "Color name is required" });
    }

    // Insert the new color into the colors table
    const [result] = await db.query(
      "INSERT INTO colors (color_name) VALUES (?)",
      [color_name]
    );

    // Respond with the newly added color's id and name
    res.status(201).json({ color_id: result.insertId, color_name });
  } catch (error) {
    console.error("Error adding color:", error);
    res.status(500).json({ error: "Failed to add color" });
  }
});

// Update an existing color
router.put("/", async (req, res) => {
  try {
    const { color_id, color_name } = req.body;

    const [result] = await db.query(
      `UPDATE colors SET color_name = ? WHERE color_id = ?`,
      [color_name, color_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating color:", error);
    res.status(500).json({ error: "Failed to update color" });
  }
});

// Delete an existing color
router.delete("/", async (req, res) => {
  try {
    const { color_id } = req.body;

    const [result] = await db.query(`DELETE FROM colors WHERE color_id = ?`, [
      color_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting color:", error);
    res.status(500).json({ error: "Failed to delete color" });
  }
});

export default router;
