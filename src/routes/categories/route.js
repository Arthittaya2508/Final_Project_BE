import express from "express";
import db from "../../lib/db.js"; // ปรับเส้นทางให้ตรงกับตำแหน่งของไฟล์ db.js ที่ใช้งาน

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
    const { category_name } = req.body;

    const [result] = await db.query(
      `INSERT INTO categories (category_name) VALUES (?)`,
      [category_name]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Update an existing category
router.put("/", async (req, res) => {
  try {
    const { category_id, category_name } = req.body;
    console.log({ category_id, category_name }); // ตรวจสอบข้อมูลที่ได้รับ

    const [result] = await db.query(
      `UPDATE categories SET category_name = ? WHERE category_id = ?`,
      [category_name, category_id]
    );
    console.log(result); // ตรวจสอบผลลัพธ์

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
    console.log({ category_id }); // ตรวจสอบข้อมูลที่ได้รับ

    const [result] = await db.query(
      `DELETE FROM categories WHERE category_id = ?`,
      [category_id]
    );
    console.log(result); // ตรวจสอบผลลัพธ์

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
