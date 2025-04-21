import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// 📌 ฟังก์ชันสำหรับหาสถานะถัดไป
function getNextStatus(currentStatusId) {
  const statuses = [
    { status_id: 1, label: "รับออเดอร์" },
    { status_id: 2, label: "จัดเตรียมเสร็จแล้ว" },
    { status_id: 3, label: "ขนส่งมารับแล้ว" },
    { status_id: 4, label: "จัดส่งแล้ว" },
    { status_id: 5, label: "สิ้นสุดคำสั่งซื้อ" },
    { status_id: 6, label: "ยกเลิกคำสั่งซื้อ" },
  ];

  const currentIndex = statuses.findIndex(
    (status) => status.status_id === currentStatusId
  );

  if (currentIndex === -1 || currentIndex + 1 >= statuses.length) {
    return null;
  }

  return statuses[currentIndex + 1];
}

// 📌 ดึงคำสั่งซื้อ (รองรับ user_id)
router.get("/:id", async (req, res) => {
  try {
    const orderId = req.params.id;

    const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
      orderId,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order" });
  }
});

// 📌 เพิ่มคำสั่งซื้อใหม่
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      order_date,
      total_amount,
      shipping_date,
      status_id,
      payment_image,
    } = req.body;

    if (
      !user_id ||
      !order_date ||
      !total_amount ||
      !shipping_date ||
      !status_id ||
      !payment_image
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO orders (user_id, order_date, total_amount, shipping_date, status_id,payment_image) 
       VALUES (?, ?, ?, ?, ?,?)`,
      [
        user_id,
        order_date,
        total_amount,
        shipping_date,
        status_id,
        payment_image,
      ]
    );

    res.json({
      success: true,
      message: "Order added successfully",
      order_id: result.insertId,
    });
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({ success: false, message: "Failed to add order" });
  }
});

// 📌 แก้ไขคำสั่งซื้อ
router.put("/:order_id", async (req, res) => {
  const { order_id } = req.params;
  const { status_id } = req.body;

  console.log("📦 PUT /:order_id called");
  console.log("🟡 order_id:", order_id);
  console.log("🟡 status_id:", status_id);

  if (!order_id || status_id === undefined) {
    console.log("❌ Missing order_id or status_id");
    return res
      .status(400)
      .json({ success: false, message: "Order ID and Status ID are required" });
  }

  try {
    const [order] = await db.query(
      "SELECT status_id FROM orders WHERE order_id = ?",
      [order_id]
    );
    console.log("🔍 Current order:", order);

    if (!order.length) {
      console.log("❌ Order not found in DB");
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const currentStatus = order[0].status_id;
    console.log("📌 Current status_id:", currentStatus);

    const nextStatus = getNextStatus(currentStatus);
    console.log("➡️ Next status:", nextStatus);

    if (!nextStatus) {
      console.log("⚠️ No next status available");
      return res
        .status(400)
        .json({ success: false, message: "No next status available" });
    }

    const [result] = await db.query(
      "UPDATE orders SET status_id = ? WHERE order_id = ?",
      [nextStatus.status_id, order_id]
    );
    console.log("🛠 Update result:", result);

    if (result.affectedRows === 0) {
      console.log("❌ Failed to update DB");
      return res
        .status(500)
        .json({ success: false, message: "Failed to update order status" });
    }

    console.log("✅ Order status updated successfully");
    res.json({
      success: true,
      message: `Order status updated successfully to ${nextStatus.label}`,
    });
  } catch (error) {
    console.error("💥 Error updating order:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
});

// 📌 ลบคำสั่งซื้อ
router.delete("/", async (req, res) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    const [result] = await db.query(`DELETE FROM orders WHERE order_id = ?`, [
      order_id,
    ]);

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ success: false, message: "Failed to delete order" });
  }
});

export default router;
