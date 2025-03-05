import express from "express";
import db from "../../lib/db.js"; // เพิ่ม `.js` ที่ท้ายไฟล์

const router = express.Router();

// Fetch all categories
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categories");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// Add a new category
router.post("/", async (req, res) => {
  try {
    const { category_name } = req.body; // รับข้อมูล category_name จาก request body

    if (!category_name) {
      return res.status(400).json({ error: "category name is required" });
    }

    // Insert the new category into the categories table
    const [result] = await db.query(
      "INSERT INTO categories (category_name) VALUES (?)",
      [category_name]
    );

    // Respond with the newly added category's id and name
    res.status(201).json({ category_id: result.insertId, category_name });
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Update an existing category
router.put("/", async (req, res) => {
  try {
    const { category_id, category_name } = req.body;

    const [result] = await db.query(
      `UPDATE categories SET category_name = ? WHERE category_id = ?`,
      [category_name, category_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// Delete an existing category
router.delete("/", async (req, res) => {
  try {
    const { category_id } = req.body;

    const [result] = await db.query(
      `DELETE FROM categories WHERE category_id = ?`,
      [category_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
