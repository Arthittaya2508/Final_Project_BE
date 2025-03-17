import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// Fetch product details with filtering by pro_detail_id
router.get("/", async (req, res) => {
  try {
    const { pro_detail_id } = req.query;

    if (!pro_detail_id) {
      return res.status(400).json({ error: "pro_detail_id is required" });
    }

    const query = "SELECT * FROM product_detail_items WHERE pro_detail_id = ?";
    const [rows] = await db.query(query, [pro_detail_id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "No product details found" });
    }

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching product details:", error);
    res.status(500).json({ error: "Failed to fetch product details" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    console.log("📥 ข้อมูลที่ได้รับจาก Frontend:", req.body);

    const {
      pro_detail_id,
      color_id,
      size_id,
      stock_quantity,
      sale_price,
      cost_price,
    } = req.body;

    if (
      pro_detail_id === undefined ||
      color_id === undefined ||
      size_id === undefined ||
      stock_quantity === undefined ||
      sale_price === undefined ||
      cost_price === undefined
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO product_detail_items (pro_detail_id, color_id, size_id, stock_quantity, sale_price, cost_price)
      VALUES (?, ?, ?, ?, ?, ?)`,

      [pro_detail_id, color_id, size_id, stock_quantity, sale_price, cost_price]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ Error inserting product:", error);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Update an existing product using item_id
router.put("/", async (req, res) => {
  try {
    const {
      item_id,
      pro_detail_id,
      color_id,
      size_id,
      stock_quantity,
      sale_price,
      cost_price,
    } = req.body;

    if (!item_id) {
      return res.status(400).json({ error: "item_id is required" });
    }

    const [result] = await db.query(
      `UPDATE product_detail_items
      SET pro_detail_id = ?, color_id = ?, size_id = ?, stock_quantity = ?, sale_price = ?, cost_price = ?
      WHERE pro_detail_id = ?`,
      [
        pro_detail_id,
        color_id,
        size_id,
        stock_quantity,
        sale_price,
        cost_price,
        item_id,
      ]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete an existing product using item_id
router.delete("/", async (req, res) => {
  try {
    const { pro_detail_id } = req.body; // หรือใช้ req.query ถ้าอยากส่งผ่าน query string

    if (!pro_detail_id) {
      return res.status(400).json({ error: "pro_detail_id is required" });
    }

    const [result] = await db.query(
      `DELETE FROM product_detail_items WHERE pro_detail_id = ?`,
      [pro_detail_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

export default router;
