import express from "express";
import db from "../../lib/db.js";

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
    const { brand_name } = req.body;

    const [result] = await db.query(
      `INSERT INTO brands (brand_name) VALUES (?)`,
      [brand_name]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting brand:", error);
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
