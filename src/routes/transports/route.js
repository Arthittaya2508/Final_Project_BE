import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js";  // ใช้ import แทน require

const router = express.Router();

// Fetch all transports
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM transports");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching transports:", error);
    res.status(500).json({ error: "Failed to fetch transports" });
  }
});

// Add a new transport
router.post("/", async (req, res) => {
  try {
    const data = req.body; // Use req.body to access the parsed JSON data
    const { tran_name, shipping_cost } = data; // Get shipping cost from request

    const [result] = await db.query(
      `INSERT INTO transports (tran_name, shipping_cost) VALUES (?, ?)`,
      [tran_name, shipping_cost] // Insert shipping cost
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting transport:", error);
    res.status(500).json({ error: "Failed to add transport" });
  }
});

// Update an existing transport
router.put("/", async (req, res) => {
  try {
    const data = req.body; // Use req.body to access the parsed JSON data
    const { tran_id, tran_name, shipping_cost } = data; // Get shipping cost from request

    const [result] = await db.query(
      `UPDATE transports SET tran_name = ?, shipping_cost = ? WHERE tran_id = ?`,
      [tran_name, shipping_cost, tran_id] // Update shipping cost
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating transport:", error);
    res.status(500).json({ error: "Failed to update transport" });
  }
});

// Delete an existing transport
router.delete("/", async (req, res) => {
  try {
    const data = req.body; // Use req.body to access the parsed JSON data
    const { tran_id } = data;

    const [result] = await db.query(
      `DELETE FROM transports WHERE tran_id = ?`,
      [tran_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting transport:", error);
    res.status(500).json({ error: "Failed to delete transport" });
  }
});

export default router;
