import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// Fetch all brands, or by company_id
router.get("/", async (req, res) => {
  try {
    const { company_id } = req.query;

    let query = "SELECT * FROM brands";
    let params = [];

    // ตรวจสอบว่ามีการส่ง company_id มาหรือไม่
    if (company_id) {
      query += " WHERE company_id = ?";
      params.push(company_id); // ใส่ company_id ลงใน parameters
    }

    const [rows] = await db.query(query, params);
    res.json(rows); // ส่งข้อมูลแบรนด์ที่กรองแล้วกลับไป
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// Add a new brand
router.post("/", async (req, res) => {
  try {
    const { brand_name, company_id } = req.body;

    if (!brand_name || !company_id) {
      return res
        .status(400)
        .json({ error: "Brand name and company ID are required" });
    }

    const [result] = await db.query(
      "INSERT INTO brands (brand_name, company_id) VALUES (?, ?)",
      [brand_name, company_id]
    );

    res.status(201).json({ brand_id: result.insertId, brand_name, company_id });
  } catch (error) {
    console.error("Error adding brand:", error);
    res.status(500).json({ error: "Failed to add brand" });
  }
});

// Update an existing brand
router.put("/", async (req, res) => {
  try {
    const { brand_id, brand_name, company_id } = req.body;

    if (!brand_id || !brand_name || !company_id) {
      return res
        .status(400)
        .json({ error: "Brand ID, name, and company ID are required" });
    }

    const [result] = await db.query(
      `UPDATE brands SET brand_name = ?, company_id = ? WHERE brand_id = ?`,
      [brand_name, company_id, brand_id]
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

    if (!brand_id) {
      return res.status(400).json({ error: "Brand ID is required" });
    }

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
