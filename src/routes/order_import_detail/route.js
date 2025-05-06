import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

console.log("✅ order_import route loaded");

// GET: ดึงข้อมูลคำสั่งซื้อทั้งหมด
router.get("/", async (req, res) => {
  console.log("📥 GET /api/order_import");
  try {
    const [rows] = await db.query("SELECT * FROM order_import");
    res.json(rows);
  } catch (err) {
    console.error("❌ ดึงข้อมูล order_import ไม่สำเร็จ:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลได้" });
  }
});

// POST: เพิ่มคำสั่งซื้อใหม่ พร้อมรายละเอียด
router.post("/", async (req, res) => {
  const { company_id, quantity, total_price, details } = req.body;

  console.log("📤 POST /api/order_import เรียกใช้งานด้วยข้อมูล:", {
    company_id,
    quantity,
    total_price,
    details,
  });

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Insert into order_import
    const [importResult] = await connection.query(
      `INSERT INTO order_import (company_id, quantity, total_price)
       VALUES (?, ?, ?)`,
      [company_id, quantity, total_price]
    );

    const order_import_id = importResult.insertId;
    console.log("✅ สร้าง order_import สำเร็จ:", order_import_id);

    // 2. Insert into order_import_detail (หลายรายการ)
    for (const item of details) {
      const { pro_id, color_id, size_id, quantity, cost_price, brand_id } =
        item;

      await connection.query(
        `INSERT INTO order_import_detail 
          (pro_id, color_id, size_id, quantity, cost_price, brand_id, order_import_id)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          pro_id,
          color_id,
          size_id,
          quantity,
          cost_price,
          brand_id,
          order_import_id,
        ]
      );
    }

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: "สั่งซื้อและรายละเอียดถูกบันทึกเรียบร้อย",
      order_import_id,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ บันทึกคำสั่งซื้อไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

export default router;
