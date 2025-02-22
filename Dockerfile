# ใช้ Node.js official image เป็น base image
FROM node:18

# ตั้ง working directory ใน container
WORKDIR /usr/src/app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกโฟลเดอร์ src ทั้งหมด
COPY src/ ./src

# เปิด port 8080 สำหรับ Cloud Run
EXPOSE 8080

# คำสั่งเริ่มต้นในการรันแอป
CMD ["node", "src/server.js"]
