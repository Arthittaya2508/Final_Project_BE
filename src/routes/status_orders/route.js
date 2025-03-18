import express from "express";
import db from "../../lib/db.js"; // เพิ่ม `.js` ที่ท้ายไฟล์

const router = express.Router();

// Fetch all statuss
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM status_order");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching statuss:", error);
    res.status(500).json({ error: "Failed to fetch statuss" });
  }
});

// Add a new status
router.post("/", async (req, res) => {
  try {
    const { status_name } = req.body; // รับข้อมูล status_name จาก request body

    if (!status_name) {
      return res.status(400).json({ error: "status name is required" });
    }

    // Insert the new status into the statuss table
    const [result] = await db.query(
      "INSERT INTO statuss (status_name) VALUES (?)",
      [status_name]
    );

    // Respond with the newly added status's id and name
    res.status(201).json({ status_id: result.insertId, status_name });
  } catch (error) {
    console.error("Error adding status:", error);
    res.status(500).json({ error: "Failed to add status" });
  }
});

// Update an existing status
router.put("/", async (req, res) => {
  try {
    const { status_id, status_name } = req.body;

    const [result] = await db.query(
      `UPDATE statuss SET status_name = ? WHERE status_id = ?`,
      [status_name, status_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// Delete an existing status
router.delete("/", async (req, res) => {
  try {
    const { status_id } = req.body;

    const [result] = await db.query(`DELETE FROM statuss WHERE status_id = ?`, [
      status_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ error: "Failed to delete status" });
  }
});

export default router;
