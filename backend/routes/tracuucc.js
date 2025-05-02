import express from 'express';
import TraCuuChungChi_DAO from '../service/tra_cuu_chung_chi_DAO.js';

const router = express.Router();
const traCuuChungChiDAO = new TraCuuChungChi_DAO();

// Get list of all PHIEUDUTHI for the table
router.get('/phieuduthi', async (req, res) => {
  try {
    const phieuDuThiList = await traCuuChungChiDAO.getAllPhieuDuThi();
    res.status(200).json(phieuDuThiList);
  } catch (err) {
    console.error('Error fetching PhieuDuThi:', err);
    res.status(500).json({ message: 'Error fetching PhieuDuThi' });
  }
});

// Get list of all MA_CHUNGCHI for the dropdown
router.get('/chungchi/list', async (req, res) => {
  try {
    const maChungChiList = await traCuuChungChiDAO.getAllMaChungChi();
    res.status(200).json(maChungChiList);
  } catch (err) {
    console.error('Error fetching MA_CHUNGCHI list:', err);
    res.status(500).json({ message: 'Error fetching MA_CHUNGCHI list' });
  }
});

// Get certificates by MA_PHIEUDUTHI
router.get('/chungchi/:maPhieuDuThi', async (req, res) => {
  const { maPhieuDuThi } = req.params;
  try {
    const certificates = await traCuuChungChiDAO.DocMaPhieuDuThiTonTai(maPhieuDuThi);
    if (certificates.length > 0) {
      res.status(200).json(certificates);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chứng chỉ với thông tin đã nhập' });
    }
  } catch (err) {
    console.error('Error searching certificates:', err);
    res.status(500).json({ message: 'Lỗi server khi tra cứu chứng chỉ' });
  }
});

// Get certificates by MA_CHUNGCHI
router.get('/chungchi/by-code/:maChungChi', async (req, res) => {
  const { maChungChi } = req.params;
  try {
    const certificates = await traCuuChungChiDAO.getCertificateByCode(maChungChi);
    if (certificates.length > 0) {
      res.status(200).json(certificates);
    } else {
      res.status(404).json({ message: 'Không tìm thấy chứng chỉ với mã đã nhập' });
    }
  } catch (err) {
    console.error('Error searching certificate by code:', err);
    res.status(500).json({ message: 'Lỗi server khi tra cứu chứng chỉ theo mã' });
  }
});

export default router;