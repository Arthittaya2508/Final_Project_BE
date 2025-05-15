import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

console.log("✅ order_import route loaded");

// GET: ดึงข้อมูลคำสั่งซื้อทั้งหมด
router.get("/", async (req, res) => {
  const { order_import_id } = req.query; // ดึงค่า query string ที่ส่งมาจาก URL

  console.log(`📥 GET /api/order_import?order_import_id=${order_import_id}`);

  try {
    let query = "SELECT * FROM order_import"; // กำหนด query เบื้องต้น
    let params = [];

    // ถ้ามีการระบุ order_import_id
    if (order_import_id) {
      query += " WHERE order_import_id = ?";
      params.push(order_import_id); // เพิ่ม order_import_id ไปใน params
    }

    const [rows] = await db.query(query, params); // ใช้ query ที่ปรับแล้ว

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลคำสั่งซื้อ" });
    }

    res.json(rows); // ส่งข้อมูลทั้งหมด (หรือแค่รายการที่ตรงกับ order_import_id)
  } catch (err) {
    console.error("❌ ดึงข้อมูล order_import ไม่สำเร็จ:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลได้" });
  }
});

// POST: เพิ่มคำสั่งซื้อใหม่ พร้อมรายละเอียด
// POST: เพิ่มคำสั่งซื้อใหม่ พร้อมรายละเอียด
router.post("/", async (req, res) => {
  const { company_id, original_quantity, total_price, details } = req.body;

  console.log("📤 POST /api/order_import เรียกใช้งานด้วยข้อมูล:", {
    company_id,
    original_quantity,
    total_price,
    details,
  });

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Insert into order_import (ใช้ NOW() สำหรับ created_at)
    const [importResult] = await connection.query(
      `INSERT INTO order_import (company_id, original_quantity, total_price, created_at)
       VALUES (?, ?, ?, NOW())`,
      [company_id, original_quantity, total_price]
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

    // 3. ดึงข้อมูล order_import กลับมาเพื่อแสดง
    const [orderImportRows] = await connection.query(
      `SELECT * FROM order_import WHERE order_import_id = ?`,
      [order_import_id]
    );

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: "สั่งซื้อและรายละเอียดถูกบันทึกเรียบร้อย",
      order_import: orderImportRows[0], // ส่งกลับข้อมูลรวมเวลา
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ บันทึกคำสั่งซื้อไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

router.put("/", async (req, res) => {
  const {
    order_import_id,
    company_id,
    original_quantity,
    total_price,
    details,
  } = req.body;

  console.log("📤 PUT /api/order_import เรียกใช้งานด้วยข้อมูล:", {
    order_import_id,
    company_id,
    original_quantity,
    totaal_price,
    details,
  });

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. อัปเดตข้อมูลใน order_import
    await connection.query(
      `UPDATE order_import 
       SET company_id = ?, original_quantity = ?, total_price = ? 
       WHERE order_import_id = ?`,
      [company_id, quantity, total_price, order_import_id]
    );

    console.log(`✅ อัปเดต order_import สำเร็จ: ${order_import_id}`);

    // 2. ดึงรายการเดิมของ order_import_detail มาก่อน
    const [existingDetails] = await connection.query(
      `SELECT * FROM order_import_detail WHERE order_import_id = ?`,
      [order_import_id]
    );

    // 3. ลูปข้อมูลใหม่เพื่ออัปเดต หรือแทรกใหม่หากไม่มี
    for (const item of details) {
      const { pro_id, color_id, size_id, quantity, cost_price, brand_id } =
        item;

      const existing = existingDetails.find(
        (d) =>
          d.pro_id === pro_id &&
          d.color_id === color_id &&
          d.size_id === size_id &&
          d.brand_id === brand_id
      );

      if (existing) {
        // ถ้ามีอยู่แล้ว อัปเดต พร้อมเก็บ original_quantity
        await connection.query(
          `UPDATE order_import_detail 
           SET original_quantity = ?, quantity = ?, cost_price = ? 
           WHERE order_import_detail_id = ?`,
          [
            existing.quantity,
            quantity,
            cost_price,
            existing.order_import_detail_id,
          ]
        );
      } else {
        // ถ้ายังไม่มี ให้ insert ใหม่
        await connection.query(
          `INSERT INTO order_import_detail 
            (pro_id, color_id, size_id, quantity, cost_price, brand_id, order_import_id, original_quantity)
           VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
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
    }

    // 4. ดึงข้อมูล order_import กลับมาเพื่อแสดง
    const [orderImportRows] = await connection.query(
      `SELECT * FROM order_import WHERE order_import_id = ?`,
      [order_import_id]
    );

    await connection.commit();
    connection.release();

    res.status(200).json({
      message: "คำสั่งซื้อและรายละเอียดได้รับการอัปเดตแล้ว",
      order_import: orderImportRows[0],
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ อัปเดตคำสั่งซื้อไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล" });
  }
});
export default router;
