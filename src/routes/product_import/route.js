import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// log เมื่อไฟล์นี้ถูกโหลดโดย server.js
console.log("✅ product_import route loaded");

// GET: ทดสอบเช็คว่ามีการเชื่อมต่อฐานข้อมูลหรือยัง
router.get("/", async (req, res) => {
  console.log("📥 GET /api/product_import");
  try {
    const [rows] = await db.query("SELECT * FROM product_import");
    res.json(rows);
  } catch (err) {
    console.error("❌ ดึงข้อมูล product_import ไม่สำเร็จ:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลได้" });
  }
});

// POST: รับคำสั่งซื้อ
router.post("/", async (req, res) => {
  const {
    company_id,
    brand_id,
    pro_id,
    color_id,
    size_id,
    quantity,
    cost_price,
    total_price,
  } = req.body;

  console.log("📤 POST /api/product_import เรียกใช้งานด้วยข้อมูล:", {
    company_id,
    brand_id,
    pro_id,
    color_id,
    size_id,
    quantity,
    cost_price,
    total_price,
    created_at,
  });

  try {
    const [result] = await db.query(
      `INSERT INTO product_import (company_id, brand_id, pro_id, color_id, size_id, quantity,cost_price,total_price,created_at)
       VALUES (?, ?, ?, ?, ?, ?,? ,?,?)`,
      [
        company_id,
        brand_id,
        pro_id,
        color_id,
        size_id,
        quantity,
        cost_price,
        total_price,
        created_at,
      ]
    );

    console.log("✅ บันทึก product_import สำเร็จ ID:", result.insertId);
    res.status(201).json({
      message: "สั่งสินค้าสำเร็จ",
      product_import_id: result.insertId,
    });
  } catch (err) {
    console.error("❌ บันทึก product_import ไม่สำเร็จ:", err);
    res.status(500).json({ message: "ไม่สามารถบันทึกคำสั่งซื้อได้" });
  }
});

export default router;
