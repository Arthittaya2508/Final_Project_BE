import express from "express"; // ใช้ import แทน require
import db from "../../lib/db.js";

const router = express.Router();

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const { brand_id } = req.query;

    let query = "SELECT * FROM products";
    let params = [];

    // ตรวจสอบว่ามีการส่ง company_id มาหรือไม่
    if (brand_id) {
      query += " WHERE brand_id = ?";
      params.push(brand_id); // ใส่ company_id ลงใน parameters
    }

    const [rows] = await db.query(query, params);
    res.json(rows); // ส่งข้อมูลแบรนด์ที่กรองแล้วกลับไป
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { sku, pro_name, pro_des, category_id, brand_id, gender_id } =
      req.body;

    // ตรวจสอบว่าทุกฟิลด์ที่ต้องการมีค่า
    if (
      !sku ||
      !pro_name ||
      !pro_des ||
      !category_id ||
      !brand_id ||
      !gender_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await db.query(
      `INSERT INTO products (sku, pro_name, pro_des, category_id, brand_id,gender_id)
      VALUES (?, ?, ?, ?, ?,? )`,
      [sku, pro_name, pro_des, category_id, brand_id, gender_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update an existing product
router.put("/", async (req, res) => {
  try {
    const { sku, pro_id, pro_name, pro_des, category_id, brand_id, gender_id } =
      req.body;

    // ตรวจสอบว่าทุกฟิลด์ที่ต้องการมีค่า
    if (
      !sku ||
      !pro_id ||
      !pro_name ||
      !pro_des ||
      !category_id ||
      !brand_id ||
      !gender_id
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await db.query(
      `UPDATE products SET sku = ?, pro_name = ?, pro_des = ?, category_id = ?, brand_id = ? ,gender_id= ? WHERE pro_id = ?`,
      [sku, pro_name, pro_des, category_id, brand_id, gender_id, pro_id]
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

    // ตรวจสอบว่ามีการระบุ pro_id หรือไม่
    if (!pro_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const [result] = await db.query(`DELETE FROM products WHERE pro_id = ?`, [
      pro_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
