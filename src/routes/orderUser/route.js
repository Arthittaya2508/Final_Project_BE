import express from "express";
import db from "../../lib/db.js";

const router = express.Router();

// ✅ Fetch orders (all หรือ filter ตาม user_id)
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = "SELECT * FROM orders";
    const values = [];

    if (user_id) {
      query += " WHERE user_id = ?";
      values.push(user_id);
    }

    query += " ORDER BY order_date DESC";

    const [rows] = await db.query(query, values);
    res.json({ orders: rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// ✅ Add a new order
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      order_date,
      total_amount,
      shipping_date,
      status_id,
      transport_id,
    } = req.body;

    const [result] = await db.query(
      `INSERT INTO orders (user_id, order_date, total_amount, shipping_date, status_id, transport_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
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

// ✅ Update an existing order
router.put("/", async (req, res) => {
  try {
    const {
      order_id,
      user_id,
      order_date,
      total_amount,
      shipping_date,
      status_id,
      transport_id,
    } = req.body;

    const [result] = await db.query(
      `UPDATE orders
       SET user_id = ?, order_date = ?, total_amount = ?, shipping_date = ?, status_id = ?, transport_id = ?
       WHERE order_id = ?`,
      [
        user_id,
        order_date,
        total_amount,
        shipping_date,
        status_id,
        transport_id,
        order_id,
      ]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// ✅ Delete an order
router.delete("/", async (req, res) => {
  try {
    const { order_id } = req.body;

    const [result] = await db.query(`DELETE FROM orders WHERE order_id = ?`, [
      order_id,
    ]);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// ✅ Export route
export default router;
