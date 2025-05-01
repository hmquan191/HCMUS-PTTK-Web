// server.js
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import dotenv from 'dotenv';

import renewalRouter from './routes/renewalRoutes.js';
import authRouter from './routes/auth.js'; // Import the auth router

import payRouter from './routes/payRoutes.js'; // Import the pay router
dotenv.config();
const app = express();
// Middleware
app.use(express.json());
app.use(cors());  // Đảm bảo frontend có thể gọi API từ server


// Cấu hình kết nối MySQL
const db = mysql.createConnection({
  host: process.env.MYSQL_HOST, // '127.0.0.1'
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});


db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL database!');
});

// Lắng nghe port
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});




app.use('/api', renewalRouter); // Sử dụng router cho các API liên quan đến gia hạn
app.use('/api', authRouter); // Sử dụng router cho các API liên quan đến gia hạn

app.use('/api', payRouter); // Sử dụng router cho các API liên quan đến thanh toán

