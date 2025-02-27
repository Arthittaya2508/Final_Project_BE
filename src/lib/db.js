import mysql from "mysql2/promise";
import dotenv from "dotenv";

// โหลดค่า .env
dotenv.config();

// ตรวจสอบการตั้งค่าค่าตัวแปรจาก .env
const {
  DATABASE_HOST,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_PORT,
} = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  console.error("❌ Missing required database configuration in .env");
  process.exit(1); // หยุดโปรแกรมหากไม่พบการตั้งค่าฐานข้อมูลที่จำเป็น
}

// สร้าง pool การเชื่อมต่อ
const pool = mysql.createPool({
  host: DATABASE_HOST || "127.0.0.1", // ค่าเริ่มต้นเป็น 127.0.0.1 ถ้าไม่ได้กำหนด
  user: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  port: DATABASE_PORT || 3306, // ตั้งค่าพอร์ตถ้าไม่ได้กำหนด
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// ฟังก์ชันสำหรับรันคำสั่ง SQL
export async function query(sql, values = []) {
  try {
    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error) {
    console.error("❌ Error executing SQL query:", error);
    throw error; // ฟาล์วคำสั่ง SQL
  }
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
    process.exit(1); // หากไม่สามารถเชื่อมต่อได้ให้หยุดโปรแกรม
  });

// ส่งออก pool และ query
export default pool;
