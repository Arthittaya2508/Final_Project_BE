import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js";
const router = express.Router();

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM product_details");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const {
      pro_id,
      color_id,
      size_id,
      gender_id,
      stock_quantity,
      sku,
      pro_image,
      sale_price,
      cost_price,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO product_details (pro_id, color_id, size_id, gender_id, stock_quantity, sku, pro_image, sale_price, cost_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        pro_id,
        color_id,
        size_id,
        gender_id,
        stock_quantity,
        sku,
        pro_image,
        sale_price,
        cost_price,
      ]
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
    const {
      pro_id,
      color_id,
      size_id,
      gender_id,
      stock_quantity,
      sku,
      pro_image,
      sale_price,
      cost_price,
    } = req.body;

    const [result] = await db.query(
      `UPDATE product_details 
      SET color_id = ?, size_id = ?, gender_id = ?, stock_quantity = ?, sku = ?, pro_image = ?, sale_price = ?, cost_price = ? 
      WHERE pro_id = ?`,
      [
        color_id,
        size_id,
        gender_id,
        stock_quantity,
        sku,
        pro_image,
        sale_price,
        cost_price,
        pro_id,
      ]
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
