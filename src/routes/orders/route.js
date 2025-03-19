import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// 📌 ดึงคำสั่งซื้อ (รองรับ user_id)
router.get("/", async (req, res) => {
  try {
    const userId = req.query.user_id;
    let query = "SELECT * FROM orders";
    let params = [];

    if (userId && userId !== "all") {
      query += " WHERE user_id = ?";
      params.push(userId);
    }

    const [rows] = await db.query(query, params);
    res.json({ success: true, orders: rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// 📌 เพิ่มคำสั่งซื้อใหม่
router.post("/", async (req, res) => {
  try {
    const { user_id, order_date, total_amount, shipping_date, status_id } =
      req.body;

    if (
      !user_id ||
      !order_date ||
      !total_amount ||
      !shipping_date ||
      !status_id
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const [result] = await db.query(
      `INSERT INTO orders (user_id, order_date, total_amount, shipping_date, status_id) 
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, order_date, total_amount, shipping_date, status_id]
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
router.put("/", async (req, res) => {
  try {
    const {
      order_id,
      user_id,
      order_date,
      total_amount,
      shipping_date,
      status_id,
    } = req.body;

    if (!order_id) {
      return res
        .status(400)
        .json({ success: false, message: "Order ID is required" });
    }

    const [result] = await db.query(
      `UPDATE orders SET user_id = ?, order_date = ?, total_amount = ?, shipping_date = ?, status_id = ? 
       WHERE order_id = ?`,
      [user_id, order_date, total_amount, shipping_date, status_id, order_id]
    );

    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
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
