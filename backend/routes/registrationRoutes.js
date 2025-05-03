import express from 'express';
import PhieuDangKy from '../service/PhieuDangKy_DAO.js'; // Import the DAO class
import KhachHang from '../service/KhachHang_DAO.js';
import LichThi from '../service/LichThi_DAO.js';

const router = express.Router();
const phieuDangKy = new PhieuDangKy();
const khachHang = new KhachHang();
const lichThi = new LichThi();

// Get list of KHACHHANG
router.get('/customers', async (req, res) => {
  try {
    const customer = await khachHang.getAllKhachHang();
    res.status(200).json(customer);
  } catch (err) {
    console.error('Error fetching KHACHHANG:', err);
    res.status(500).json({ message: 'Error fetching KHACHHANG' });
  }
});

// Get list of LICHTHI
router.get('/schedules', async (req, res) => {
  try {
    const schedule = await lichThi.getAllLichThi();
    res.status(200).json(schedule);
  } catch (err) {
    console.error('Error fetching LICHTHI:', err);
    res.status(500).json({ message: 'Error fetching LICHTHI' });
  }
});

// Get list of PHIEUDANGKY
router.get('/registrations', async (req, res) => {
  try {
    const registration = await phieuDangKy.getAllPhieuDangKy();
    res.status(200).json(registration);
  } catch (err) {
    console.error('Error fetching PHIEUDANGKY:', err);
    res.status(500).json({ message: 'Error fetching PHIEUDANGKY' });
  }
});

// Registration API - Create a new registration
router.post('/registrations', async (req, res) => {
  const PhieuDangKy_Data = req.body;

  try {
    const result = await phieuDangKy.createPhieuDangKy(PhieuDangKy_Data);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error creating registration' });
  }
});

export default router;