import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js";

const router = express.Router();

// Fetch all products
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);  
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Add a new product
router.post("/", async (req, res) => {
  try {
    const { pro_name, pro_des, type_id, band_id } = req.body;

    const [result] = await db.query(
      `INSERT INTO products (pro_name, pro_des, type_id, band_id)
      VALUES (?, ?, ?, ?)`,
      [pro_name, pro_des, type_id, band_id]
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
    const { pro_id, pro_name, pro_des, type_id, band_id } = req.body;

    const [result] = await db.query(
      `UPDATE products SET pro_name = ?, pro_des = ?, type_id = ?, band_id = ? WHERE pro_id = ?`,
      [pro_name, pro_des, type_id, band_id, pro_id]
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
