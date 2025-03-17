import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRouter from "./routes/categories/route.js";
import sizesRouter from "./routes/sizes/route.js";
import transportsRouter from "./routes/transports/route.js";
import addressRouter from "./routes/address/route.js";
import brandsRouter from "./routes/brands/route.js";
import gendersRouter from "./routes/genders/route.js";
import colorsRouter from "./routes/colors/route.js";
import productsRouter from "./routes/products/route.js";
import productDetailsRouter from "./routes/product_details/route.js";
import registersRouter from "./routes/registers/route.js";
import employeesRouter from "./routes/employees/route.js";
import ordersRouter from "./routes/orders/route.js";
import usersRouter from "./routes/users/route.js";
import orderDetailsRouter from "./routes/order_details/route.js";
import companyRouter from "./routes/company/route.js";
import productDetailItemRouter from "./routes/product_detail_items/route.js";

// โหลดค่า .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // กำหนดให้ใช้พอร์ตจาก Render หรือพอร์ต 10000 เป็นค่าตั้งต้น

// ตั้งค่า CORS ให้รองรับ Production และ Development
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
  })
);

// ให้สามารถใช้ JSON จาก body ของ request
app.use(express.json());

// ตั้งค่ารูทต่างๆ
app.use("/api/categories", categoriesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/sizes", sizesRouter);
app.use("/api/transports", transportsRouter);
app.use("/api/address", addressRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/genders", gendersRouter);
app.use("/api/colors", colorsRouter);
app.use("/api/products", productsRouter);
app.use("/api/product_details", productDetailsRouter);
app.use("/api/registers", registersRouter);
app.use("/api/employees", employeesRouter);
app.use("/api/users", usersRouter);
app.use("/api/order_details", orderDetailsRouter);
app.use("/api/company", companyRouter);
app.use("/api/product_detail_items", productDetailItemRouter);

// // Start Server
app.listen(PORT, "0.0.0.0", () => {
  // ต้องฟังที่ 0.0.0.0 เพื่อให้สามารถรับคำขอจากภายนอกได้
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

export default app;
