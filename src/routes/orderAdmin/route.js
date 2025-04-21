import express from "express"; // ใช้ import แทน require
import db from "../../lib/db.js"; // ใช้ import แทน require

const router = express.Router();

// Fetch all orders
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Add a new order
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const {
      user_id,
      order_date,
      total_amount,
      shipping_date,
      status_id,
      transport_id,
    } = data;

    const [result] = await db.query(
      `INSERT INTO orders (user_id, order_date, total_amount, shipping_date, status_id,transport_id) VALUES (?, ?,?, ?, ?, ?)`,
      [
        user_id,
        order_date,
        total_amount,
        shipping_date,
        status_id,
        transport_id,
      ]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting order:", error);
    res.status(500).json({ error: "Failed to add order" });
  }
});

// Update an existing order
router.put("/", async (req, res) => {
  try {
    const data = req.body;
    const {
      order_id,
      user_id,
      order_date,
      total_amount,
      shipping_date,
      status_id,
      transport_id,
    } = data;

    const [result] = await db.query(
      `UPDATE orders SET user_id = ?, order_date = ?, total_amount = ?, shipping_date = ?, status_id = ?,transport_id = ? WHERE order_id = ?`,
      [
        user_id,
        order_date,
        total_amount,
        shipping_date,
        status_id,
        order_id,
        transport_id,
      ]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Delete an existing order
router.delete("/", async (req, res) => {
  try {
    const data = req.body;
    const { order_id } = data;

    const [result] = await db.query(`DELETE FROM orders WHERE order_id = ?`, [
      order_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// เปลี่ยนจาก module.exports เป็น export default
export default router;
