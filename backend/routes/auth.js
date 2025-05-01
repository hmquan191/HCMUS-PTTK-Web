// routes/auth.js
import express from 'express';
import { pool } from '../database.js'; // Import the database pool

const authRouter = express.Router();

// API đăng nhập
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [results] = await pool.query('SELECT * FROM TAIKHOAN WHERE TEN_DANGNHAP = ?', [username]);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    if (user.MATKHAU === password) {
      res.status(200).json({ message: 'Login successful', user });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default authRouter;