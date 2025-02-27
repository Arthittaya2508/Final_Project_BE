import mysql from "mysql2/promise";
import dotenv from "dotenv";

// โหลดค่า .env
dotenv.config();

// สร้าง pool การเชื่อมต่อ
const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT || 3306, // ตั้งค่าพอร์ตถ้าไม่ได้กำหนด
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ฟังก์ชันสำหรับรันคำสั่ง SQL
export async function query(sql, values = []) {
  const [rows] = await pool.execute(sql, values);
  return rows;
}

// ทดสอบการเชื่อมต่อกับฐานข้อมูล
pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Database connected!");
    connection.release(); // ปล่อยการเชื่อมต่อหลังจากเชื่อมต่อสำเร็จ
  })
  .catch((error) => {
    console.error("❌ Error connecting to the database:", error);
  });

// ส่งออก pool และ query
export default pool;
