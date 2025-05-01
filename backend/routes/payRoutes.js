import express from 'express';
import ThanhToan_DAO from '../service/thanh_toan_DAO.js';

const router = express.Router();
const thanhToanDAO = new ThanhToan_DAO();

// Get list of registration tickets (PHIEUDANGKY)
router.get('/registrations', async (req, res) => {
  try {
    const registrations = await thanhToanDAO.getAllPhieuDangKy();
    res.status(200).json(registrations);
  } catch (err) {
    console.error('Error fetching registrations:', err);
    res.status(500).json({ message: 'Error fetching registration tickets' });
  }
});

// Search registration ticket by MA_PHIEUDANGKY
router.get('/registrations/:maPhieuDangKy', async (req, res) => {
  const { maPhieuDangKy } = req.params;
  try {
    const registration = await thanhToanDAO.getPhieuDangKyById(maPhieuDangKy);
    if (registration) {
      res.status(200).json(registration);
    } else {
      res.status(404).json({ message: 'Registration ticket not found' });
    }
  } catch (err) {
    console.error('Error searching registration:', err);
    res.status(500).json({ message: 'Error searching registration ticket' });
  }
});

// Get list of payment tickets (PHIEUTHANHTOAN)
router.get('/payments', async (req, res) => {
  try {
    const payments = await thanhToanDAO.getAllPhieuThanhToan();
    res.status(200).json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Error fetching payment tickets' });
  }
});

// Create a new payment ticket (PHIEUTHANHTOAN)
router.post('/payments', async (req, res) => {
  const paymentData = req.body;
  try {
    const result = await thanhToanDAO.createPhieuThanhToan(paymentData);
    res.status(201).json({ success: true, message: 'Payment ticket created successfully' });
  } catch (err) {
    console.error('Error creating payment ticket:', err);
    res.status(500).json({ message: 'Error creating payment ticket' });
  }
});

export default router;