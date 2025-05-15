import express from "express";
import db from "../../lib/db.js"; // เชื่อมต่อ MySQL

const router = express.Router();
// GET /api/product_receive
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        pr.receive_id,
        pr.actual_quantity,
        pr.received_at,
        oid.order_import_detail_id,
        oid.pro_id,
        oid.color_id,
        oid.size_id,
        oid.quantity AS ordered_quantity,
        oid.cost_price,
        oid.brand_id,
        oid.order_import_id
      FROM 
        product_receive pr
      JOIN 
        order_import_detail oid ON pr.order_import_detail_id = oid.order_import_detail_id
      ORDER BY pr.received_at DESC
    `);

    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error fetching product receives", error: err.message });
  }
});
router.post("/", async (req, res) => {
  const { receiveItems } = req.body;

  if (!Array.isArray(receiveItems) || receiveItems.length === 0) {
    return res.status(400).json({ message: "Invalid receive items" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    for (const item of receiveItems) {
      const { order_import_detail_id, actual_quantity } = item;

      if (!order_import_detail_id || actual_quantity == null) {
        throw new Error("Missing order_import_detail_id or actual_quantity");
      }

      // Insert into product_receive
      await conn.query(
        "INSERT INTO product_receive (order_import_detail_id, actual_quantity) VALUES (?, ?)",
        [order_import_detail_id, actual_quantity]
      );

      // (Optional) คุณสามารถอัปเดต stock ที่ table อื่นได้ที่นี่หากต้องการ
    }

    await conn.commit();
    res.status(200).json({ message: "Product receive saved successfully" });
  } catch (err) {
    await conn.rollback();
    console.error("❌ Error in POST /product_receive:", err);
    res.status(500).json({
      message: "Error saving product receive",
      error: err.message,
    });
  } finally {
    conn.release();
  }
});

export default router;
