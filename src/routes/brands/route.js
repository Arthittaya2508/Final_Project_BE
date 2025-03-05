import express from "express";
import db from "../../lib/db.js"; // เพิ่ม `.js` ที่ท้ายไฟล์

const router = express.Router();

// Fetch all brands
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM brands");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// Add a new brand
router.post("/", async (req, res) => {
  try {
    const { brand_name } = req.body; // รับข้อมูล brand_name จาก request body

    if (!brand_name) {
      return res.status(400).json({ error: "Color name is required" });
    }

    // Insert the new brand into the brands table
    const [result] = await db.query(
      "INSERT INTO brands (brand_name) VALUES (?)",
      [brand_name]
    );

    // Respond with the newly added brand's id and name
    res.status(201).json({ brand_id: result.insertId, brand_name });
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ error: "Failed to add brand" });
  }
});

// Update an existing brand
router.put("/", async (req, res) => {
  try {
    const { brand_id, brand_name } = req.body;

    const [result] = await db.query(
      `UPDATE brands SET brand_name = ? WHERE brand_id = ?`,
      [brand_name, brand_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ error: "Failed to update brand" });
  }
});

// Delete an existing brand
router.delete("/", async (req, res) => {
  try {
    const { brand_id } = req.body;

    const [result] = await db.query(`DELETE FROM brands WHERE brand_id = ?`, [
      brand_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

export default router;
