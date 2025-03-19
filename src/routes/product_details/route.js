import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// กำหนดให้ Express ใช้ express.json() เพื่อแปลงข้อมูล JSON ใน body
router.use(express.json()); // เพิ่มบรรทัดนี้

// Fetch product details with filtering by pro_id
router.get("/", async (req, res) => {
  try {
    const { pro_id } = req.query;

    if (!pro_id) {
      return res.status(400).json({ error: "pro_id is required" });
    }

    const query = "SELECT * FROM product_details WHERE pro_id = ?";
    const [rows] = await db.query(query, [pro_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No product details found" });
    }

    res.json(rows); // ส่งคืนข้อมูลทั้งหมดที่มี pro_id ตรงกัน
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    console.log("📥 ข้อมูลที่ได้รับจาก Frontend:", req.body);

    const { pro_id, gender_id, pro_image } = req.body;

    // ตรวจสอบว่าไม่มีค่าเป็น undefined หรือ null
    if (
      pro_id === undefined ||
      gender_id === undefined ||
      pro_image === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO product_details (pro_id, gender_id, pro_image)
      VALUES (?, ?, ?)`,
      [pro_id, gender_id, pro_image]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ Error inserting product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update an existing product
router.put("/", async (req, res) => {
  try {
    const { pro_id, gender_id, pro_image } = req.body;

    const [result] = await db.query(
      `UPDATE product_details 
      SET gender_id = ?, pro_image = ?
      WHERE pro_id = ?`,
      [gender_id, pro_image, pro_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete an existing product
router.delete("/", async (req, res) => {
  try {
    const { pro_id } = req.body;

    const [result] = await db.query(
      `DELETE FROM product_details WHERE pro_id = ?`,
      [pro_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
