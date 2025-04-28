// server.js
import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

import dotenv from 'dotenv';
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

// API đăng nhập
app.post('/', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM TAIKHOAN WHERE TEN_DANGNHAP = ?';
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    
    // Kiểm tra mật khẩu
    if (user.MATKHAU === password) {  // Nếu bạn dùng bcrypt, thay bằng bcrypt.compare()
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  });
});

// Lắng nghe port
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
