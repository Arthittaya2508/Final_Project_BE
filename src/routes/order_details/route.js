import express from "express";  // ใช้ import แทน require
import db from "../../lib/db.js";

const router = express.Router();

// Fetch all order_details
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM order_details");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching order_details:", error);
    res.status(500).json({ error: "Failed to fetch order_details" });
  }
});

// Add a new order
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const { order_detail_id, order_id, product_id, quantity, selling_price, total_price, total_quantity, transport_id } = data;

    const [result] = await db.query(
      `INSERT INTO order_details (order_detail_id, order_id, product_id, quantity, selling_price, total_price, total_quantity, transport_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

      [order_detail_id, order_id, product_id, quantity, selling_price, total_price, total_quantity, transport_id]
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
    const { order_detail_id, order_id, product_id, quantity, selling_price, total_price, total_quantity, transport_id } = data;

    const [result] = await db.query(
      `UPDATE order_details 
       SET order_detail_id = ?, order_id = ?, product_id = ?, quantity = ?, selling_price = ?, total_price = ?, total_quantity = ?, transport_id = ? 
       WHERE order_detail_id = ?`,

      [order_detail_id, order_id, product_id, quantity, selling_price, total_price, total_quantity, transport_id, order_detail_id]
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
    const { order_detail_id } = req.body;

    const [result] = await db.query(
      `DELETE FROM order_details WHERE order_detail_id = ?`,
      [order_detail_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
});

// ใช้ export default เพื่อให้สามารถนำเข้าใน server.js
export default router;
