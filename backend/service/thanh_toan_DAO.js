import { pool } from '../database.js';

class ThanhToan_DAO {
  // Get all registration tickets (PHIEUDANGKY)
  async getAllPhieuDangKy() {
    const sql = `
      SELECT p.MA_PHIEUDANGKY, p.NGAYLAP, p.TRANGTHAI_THANHTOAN, 
             p.NV_LAP, p.MA_LICHTHI, p.MA_KH, 
             k.TEN_KH, l.NGAYTHI, l.GIOTHI
      FROM PHIEUDANGKY p
      JOIN KHACHHANG k ON p.MA_KH = k.MA_KH
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
    `;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching PhieuDangKy:', err);
      throw err;
    }
  }

  // Get a registration ticket by MA_PHIEUDANGKY
  async getPhieuDangKyById(maPhieuDangKy) {
    const sql = `
      SELECT p.MA_PHIEUDANGKY, p.NGAYLAP, p.TRANGTHAI_THANHTOAN, 
             p.NV_LAP, p.MA_LICHTHI, p.MA_KH, 
             k.TEN_KH, l.NGAYTHI, l.GIOTHI
      FROM PHIEUDANGKY p
      JOIN KHACHHANG k ON p.MA_KH = k.MA_KH
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
      WHERE p.MA_PHIEUDANGKY = ?
    `;
    try {
      const [results] = await pool.query(sql, [maPhieuDangKy]);
      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error('Error fetching PhieuDangKy by ID:', err);
      throw err;
    }
  }

  // Get all payment tickets (PHIEUTHANHTOAN)
  async getAllPhieuThanhToan() {
    const sql = `
      SELECT pt.MA_PHIEUTHANHTOAN, pt.NGAYLAP, pt.TRANGTHAI_THANHTOAN, 
             pt.TONGTIEN, pt.NGAYTHANHTOAN, pt.GIAMGIA, 
             pt.NV_LAP, pt.MA_PHIEUDANGKY, pt.MA_KH, 
             k.TEN_KH
      FROM PHIEUTHANHTOAN pt
      JOIN KHACHHANG k ON pt.MA_KH = k.MA_KH
    `;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching PhieuThanhToan:', err);
      throw err;
    }
  }

  // Create a new payment ticket (PHIEUTHANHTOAN) and update PHIEUDANGKY
  async createPhieuThanhToan(paymentData) {
    const { MA_PHIEUTHANHTOAN, NGAYLAP, TRANGTHAI_THANHTOAN, TONGTIEN, NGAYTHANHTOAN, GIAMGIA, NV_LAP, MA_PHIEUDANGKY, MA_KH } = paymentData;
    const insertSql = `
      INSERT INTO PHIEUTHANHTOAN (MA_PHIEUTHANHTOAN, NGAYLAP, TRANGTHAI_THANHTOAN, TONGTIEN, NGAYTHANHTOAN, GIAMGIA, NV_LAP, MA_PHIEUDANGKY, MA_KH)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const updateSql = `
      UPDATE PHIEUDANGKY 
      SET TRANGTHAI_THANHTOAN = ?
      WHERE MA_PHIEUDANGKY = ?
    `;
    try {
      // Start a transaction to ensure atomicity
      await pool.query('START TRANSACTION');

      // Insert the new PHIEUTHANHTOAN record
      await pool.query(insertSql, [
        MA_PHIEUTHANHTOAN,
        NGAYLAP,
        TRANGTHAI_THANHTOAN,
        TONGTIEN,
        NGAYTHANHTOAN,
        GIAMGIA,
        NV_LAP,
        MA_PHIEUDANGKY,
        MA_KH,
      ]);

      // Update the TRANGTHAI_THANHTOAN in PHIEUDANGKY
      await pool.query(updateSql, [TRANGTHAI_THANHTOAN, MA_PHIEUDANGKY]);

      // Commit the transaction
      await pool.query('COMMIT');

      return { success: true };
    } catch (err) {
      // Rollback the transaction on error
      await pool.query('ROLLBACK');
      console.error('Error creating PhieuThanhToan:', err);
      throw err;
    }
  }
}

export default ThanhToan_DAO;