import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js"; // ใช้ import แทน require

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
    const data = req.body;
    const { size_name } = data;

    const [result] = await db.query(
      `INSERT INTO sizes (size_name) VALUES (?)`,
      [size_name]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting size:", error);
    res.status(500).json({ error: "Failed to add size" });
  }
});

// Update an existing size
router.put("/", async (req, res) => {
  try {
    const data = req.body;
    const { size_id, size_name } = data;

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
    const data = req.body;
    const { size_id } = data;

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
