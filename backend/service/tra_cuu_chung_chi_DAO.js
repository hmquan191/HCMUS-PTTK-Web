// service/tra_cuu_chung_chi_DAO.js
import { pool } from '../database.js';

class TraCuuChungChi_DAO {
  // Get all certificates (CHUNGCHI)
  async getAllCertificates() {
    const sql = `
      SELECT c.MA_CHUNGCHI, c.TENCHUNGCHI, c.NGAYCAP, c.NGAYHETHAN, c.TRANGTHAINHAN, 
             c.KETQUA, c.DIEMSO, c.MA_PHIEUDUTHI, k.TEN_KH, l.NGAYTHI AS EXAM_DATE
      FROM CHUNGCHI c
      JOIN PHIEUDUTHI p ON c.MA_PHIEUDUTHI = p.MA_PHIEUDUTHI
      JOIN KHACHHANG k ON c.MA_KH = k.MA_KH
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
    `;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching certificates:', err);
      throw err;
    }
  }

  // Get a certificate by MA_PHIEUDUTHI
  async DocMaPhieuDuThiTonTai(maPhieuDuThi) {
    const sql = `
      SELECT c.MA_CHUNGCHI, c.TENCHUNGCHI, c.NGAYCAP, c.NGAYHETHAN, c.TRANGTHAINHAN, 
             c.KETQUA, c.DIEMSO, c.MA_PHIEUDUTHI, k.TEN_KH, l.NGAYTHI AS EXAM_DATE
      FROM CHUNGCHI c
      JOIN PHIEUDUTHI p ON c.MA_PHIEUDUTHI = p.MA_PHIEUDUTHI
      JOIN KHACHHANG k ON c.MA_KH = k.MA_KH
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
      WHERE c.MA_PHIEUDUTHI = ?
    `;
    try {
      const [results] = await pool.query(sql, [maPhieuDuThi]);
      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error('Error fetching certificate by MA_PHIEUDUTHI:', err);
      throw err;
    }
  }

  // Get a certificate by MA_CHUNGCHI
  async getCertificateByCode(maChungChi) {
    const sql = `
      SELECT c.MA_CHUNGCHI, c.TENCHUNGCHI, c.NGAYCAP, c.NGAYHETHAN, c.TRANGTHAINHAN, 
             c.KETQUA, c.DIEMSO, c.MA_PHIEUDUTHI, k.TEN_KH, l.NGAYTHI AS EXAM_DATE
      FROM CHUNGCHI c
      JOIN PHIEUDUTHI p ON c.MA_PHIEUDUTHI = p.MA_PHIEUDUTHI
      JOIN KHACHHANG k ON c.MA_KH = k.MA_KH
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
      WHERE c.MA_CHUNGCHI = ?
    `;
    try {
      const [results] = await pool.query(sql, [maChungChi]);
      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error('Error fetching certificate by MA_CHUNGCHI:', err);
      throw err;
    }
  }

  // Update certificate status (e.g., TRANGTHAINHAN)
  async updateCertificateStatus(maChungChi, newStatus) {
    const updateSql = `
      UPDATE CHUNGCHI 
      SET TRANGTHAINHAN = ?
      WHERE MA_CHUNGCHI = ?
    `;
    try {
      await pool.query('START TRANSACTION');
      await pool.query(updateSql, [newStatus, maChungChi]);
      await pool.query('COMMIT');
      return { success: true, message: 'Certificate status updated successfully' };
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('Error updating certificate status:', err);
      throw err;
    }
  }
}

export default TraCuuChungChi_DAO;