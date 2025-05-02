// backend/routes/examRoutes.js
import express from 'express';
import { pool } from '../database.js';

const pdtRouter = express.Router();

// Fetch all exam tickets (PHIEUDUTHI) with related LICHTHI data
pdtRouter.get('/pdt', async (req, res) => {
  try {
    const [results] = await pool.query(`
      SELECT p.MA_PHIEUDUTHI, p.MA_PHIEUDANGKY, p.LAN_GIAHAN, l.NGAYTHI, l.GIOTHI
      FROM PHIEUDUTHI p
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
    `);
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching exam tickets:', err);
    res.status(500).json({ message: 'Error fetching exam tickets' });
  }
});

// Fetch a specific exam ticket by ID
pdtRouter.get('/pdt/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await pool.query(`
      SELECT p.MA_PHIEUDUTHI, p.MA_PHIEUDANGKY, p.LAN_GIAHAN, l.NGAYTHI, l.GIOTHI
      FROM PHIEUDUTHI p
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
      WHERE p.MA_PHIEUDUTHI = ?
    `, [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Exam ticket not found' });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error fetching exam ticket:', err);
    res.status(500).json({ message: 'Error fetching exam ticket' });
  }
});

// Fetch all renewal tickets (PHIEUGIAHAN)
pdtRouter.get('/renewals', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM PHIEUGIAHAN');
    res.status(200).json(results);
  } catch (err) {
    console.error('Error fetching renewal tickets:', err);
    res.status(500).json({ message: 'Error fetching renewal tickets' });
  }
});

export default pdtRouter;