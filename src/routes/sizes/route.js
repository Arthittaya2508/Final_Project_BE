import express from "express";
import db from "../../lib/db.js"; // เพิ่ม `.js` ที่ท้ายไฟล์

const router = express.Router();

// Fetch all sizes
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM sizes");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching sizes:", error);
    res.status(500).json({ error: "Failed to fetch sizes" });
  }
});

// Add a new size
router.post("/", async (req, res) => {
  try {
    const { size_name } = req.body; // รับข้อมูล size_name จาก request body

    if (!size_name) {
      return res.status(400).json({ error: "size name is required" });
    }

    // Insert the new size into the sizes table
    const [result] = await db.query(
      "INSERT INTO sizes (size_name) VALUES (?)",
      [size_name]
    );

    // Respond with the newly added size's id and name
    res.status(201).json({ size_id: result.insertId, size_name });
  } catch (error) {
    console.error("Error adding size:", error);
    res.status(500).json({ error: "Failed to add size" });
  }
});

// Update an existing size
router.put("/", async (req, res) => {
  try {
    const { size_id, size_name } = req.body;

    const [result] = await db.query(
      `UPDATE sizes SET size_name = ? WHERE size_id = ?`,
      [size_name, size_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating size:", error);
    res.status(500).json({ error: "Failed to update size" });
  }
});

// Delete an existing size
router.delete("/", async (req, res) => {
  try {
    const { size_id } = req.body;

    const [result] = await db.query(`DELETE FROM sizes WHERE size_id = ?`, [
      size_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting size:", error);
    res.status(500).json({ error: "Failed to delete size" });
  }
});

export default router;
