
import app from "./server";

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {  // ต้องฟังที่ 0.0.0.0 เพื่อให้สามารถรับคำขอจากภายนอกได้
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});

