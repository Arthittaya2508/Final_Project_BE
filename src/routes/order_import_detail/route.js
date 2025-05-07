import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

console.log("✅ order_import_detail route loaded");

// ✅ แก้ตรงนี้
router.get("/", async (req, res) => {
  const order_import_id = req.query.order_import_id;

  try {
    let query = "SELECT * FROM order_import_detail"; // เริ่มต้นด้วยการดึงข้อมูลทั้งหมด
    let params = [];

    // ถ้ามีการระบุ order_import_id
    if (order_import_id) {
      query += " WHERE order_import_id = ?";
      params.push(order_import_id); // เพิ่ม order_import_id ไปใน params
    }

    const [result] = await db.query(query, params); // ใช้ query ที่ปรับแล้ว

    if (result.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูล" });
    }

    res.json(result); // ส่งข้อมูลทั้งหมดหรือแค่รายการที่ตรงกับ order_import_id
  } catch (err) {
    console.error("❌ ดึงข้อมูล order_import_detail ไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// POST route นี้ถูกต้องแล้ว
router.post("/", async (req, res) => {
  const {
    pro_id,
    color_id,
    size_id,
    quantity,
    cost_price,
    brand_id,
    order_import_id,
  } = req.body;

  console.log("📤 POST /api/order_import_detail เรียกใช้งานด้วยข้อมูล:", {
    pro_id,
    color_id,
    size_id,
    quantity,
    cost_price,
    brand_id,
    order_import_id,
  });

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const [result] = await connection.query(
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

    const order_import_detail_id = result.insertId;
    console.log("✅ สร้าง order_import_detail สำเร็จ:", order_import_detail_id);

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: "รายละเอียดคำสั่งซื้อถูกบันทึกเรียบร้อย",
      order_import_detail_id,
    });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ บันทึกรายละเอียดคำสั่งซื้อไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
  }
});

router.put("/", async (req, res) => {
  const order_import_id = req.query.order_import_id;
  const items = req.body.items;

  if (!order_import_id || !Array.isArray(items)) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }

  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    for (const item of items) {
      const { pro_id, color_id, size_id, quantity, cost_price } = item;

      await connection.query(
        `UPDATE order_import_detail
         SET quantity = ?, cost_price = ?
         WHERE order_import_id = ? AND pro_id = ? AND color_id = ? AND size_id = ?`,
        [quantity, cost_price, order_import_id, pro_id, color_id, size_id]
      );
    }

    await connection.commit();
    connection.release();

    res.status(200).json({ message: "อัปเดตสำเร็จ" });
  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error("❌ อัปเดตรายการไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต" });
  }
});

export default router;
