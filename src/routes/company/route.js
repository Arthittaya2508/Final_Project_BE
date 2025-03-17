import express from "express"; // ใช้ import แทน require
import db from "../../lib/db.js";

const router = express.Router();

// Fetch all companys
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM company");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching companys:", error);
    res.status(500).json({ error: "Failed to fetch companys" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { company_name, address, phone } = req.body;

    // ตรวจสอบว่าทุกฟิลด์ที่ต้องการมีค่า
    if (!company_name || !address || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const [result] = await db.query(
      `INSERT INTO company ( company_name, address, phone)
      VALUES (?, ?, ?)`,
      [company_name, address, phone]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error inserting company:", error);
    res.status(500).json({ error: "Failed to add company" });
  }
});

// Update an existing company
router.put("/", async (req, res) => {
  try {
    const { company_name, address, phone } = req.body;

    const [result] = await db.query(
      `UPDATE company SET comcompany_name = ? address = ?, phone = ? WHERE company_id = ?`[
        (company_name, address, phone)
      ]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ error: "Failed to update company" });
  }
});

// Delete an existing company
router.delete("/", async (req, res) => {
  try {
    const { company_id } = req.body;

    const [result] = await db.query(
      `DELETE FROM company WHERE company_id = ?`,
      [company_id]
    );

    res.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ error: "Failed to delete company" });
  }
});

export default router;
