// routes/tracuucc.js
import express from 'express';
import TraCuuChungChi_DAO from '../service/tra_cuu_chung_chi_DAO.js';

const router = express.Router();
const traCuuChungChiDAO = new TraCuuChungChi_DAO();

// Get list of all certificates (CHUNGCHI)
router.get('/certificates', async (req, res) => {
  try {
    const certificates = await traCuuChungChiDAO.getAllCertificates();
    res.status(200).json(certificates);
  } catch (err) {
    console.error('Error fetching certificates:', err);
    res.status(500).json({ message: 'Error fetching certificates' });
  }
});

// Search certificate by MA_PHIEUDUTHI
router.get('/certificates/:maPhieuDuThi', async (req, res) => {
  const { maPhieuDuThi } = req.params;
  try {
    const certificate = await traCuuChungChiDAO.DocMaPhieuDuThiTonTai(maPhieuDuThi);
    if (certificate) {
      res.status(200).json(certificate);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chứng chỉ với thông tin đã nhập' });
    }
  } catch (err) {
    console.error('Error searching certificate:', err);
    res.status(500).json({ message: 'Lỗi server khi tra cứu chứng chỉ' });
  }
});

// (Optional) Future endpoint to search by MA_CHUNGCHI (if needed)
router.get('/certificates/by-code/:maChungChi', async (req, res) => {
  const { maChungChi } = req.params;
  try {
    const certificate = await traCuuChungChiDAO.getCertificateByCode(maChungChi);
    if (certificate) {
      res.status(200).json(certificate);
    } else {
      res.status(404).json({ message: 'Certificate not found with the provided code' });
    }
  } catch (err) {
    console.error('Error searching certificate by code:', err);
    res.status(500).json({ message: 'Error searching certificate by code' });
  }
});

export default router;