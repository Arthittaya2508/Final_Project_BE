import express from "express";
import db from "../../lib/db.js"; // เพิ่ม .js ที่ท้ายไฟล์

const router = express.Router();

// Fetch all employees
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM employees");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

// Register a new employee
router.post("/", async (req, res) => {
  const connection = await db.getConnection(); // Get connection for transaction

  try {
    const {
      name,
      lastname,
      phoneNumber,
      email,
      username,
      password,
      image,
      position,
    } = req.body;

    await connection.beginTransaction(); // Start transaction

    // Insert employee data
    const [employeeResult] = await connection.query(
      `INSERT INTO employees (name, lastname, phoneNumber, email, username, password, image, position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, lastname, phoneNumber, email, username, password, image, position]
    );

    const emp_id = employeeResult.insertId; // Get insertId

    await connection.commit(); // Commit transaction

    res.json({ success: true, emp_id });
  } catch (error) {
    await connection.rollback(); // Rollback transaction in case of error
    console.error("Error inserting employee:", error);
    res.status(500).json({ error: "Failed to register employee" });
  } finally {
    connection.release(); // Release connection
  }
});

// Update employee information
router.put("/", async (req, res) => {
  const connection = await db.getConnection(); // Get connection for transaction

  try {
    const {
      emp_id,
      name,
      lastname,
      phoneNumber,
      email,
      username,
      password,
      image,
      position,
    } = req.body;

    await connection.beginTransaction(); // Start transaction

    // Update employee data
    await connection.query(
      `UPDATE employees SET name = ?, lastname = ?, phoneNumber = ?, email = ?, username = ?, password = ?, image = ?, position = ?
       WHERE id = ?`,
      [
        name,
        lastname,
        phoneNumber,
        email,
        username,
        password,
        image,
        position,
        emp_id,
      ]
    );

    await connection.commit(); // Commit transaction

    res.json({ success: true });
  } catch (error) {
    await connection.rollback(); // Rollback transaction in case of error
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  } finally {
    connection.release(); // Release connection
  }
});

// Delete employee
router.delete("/", async (req, res) => {
  const connection = await db.getConnection(); // Get connection for transaction

  try {
    const { emp_id } = req.body;

    await connection.beginTransaction(); // Start transaction

    // Delete employee data
    await connection.query(`DELETE FROM employees WHERE id = ?`, [emp_id]);

    await connection.commit(); // Commit transaction

    res.json({ success: true });
  } catch (error) {
    await connection.rollback(); // Rollback transaction in case of error
    console.error("Error deleting employee:", error);
    res.status(500).json({ error: "Failed to delete employee" });
  } finally {
    connection.release(); // Release connection
  }
});

export default router;
