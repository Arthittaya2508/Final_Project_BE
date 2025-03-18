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
import statusOrdersRouter from "./routes/status_orders/route.js";

// โหลดค่า .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000; // ใช้พอร์ตจาก .env หรือค่าเริ่มต้น

// ตั้งค่า CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

// ✅ เพิ่มการตั้งค่าขนาด request body
app.use(express.json({ limit: "50mb" })); // ปรับ limit เป็น 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true })); // รองรับ URL-encoded data ที่มีขนาดใหญ่

// ตั้งค่ารูท API
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
app.use("/api/status_orders", statusOrdersRouter);

// Start Server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

export default app;
