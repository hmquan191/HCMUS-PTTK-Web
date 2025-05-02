import { pool } from '../database.js'; // Import the pool from database.js

class PhieuDangKy {
  // Create a new PhieuDangKy (registration record)
  async createPhieuDangKy(phieuDangKy) {
    const { MA_PHIEUDANGKY, NGAYLAP, TRANGTHAI_THANHTOAN, NV_LAP, MA_LICHTHI, MA_KH } = phieuDangKy;
    const sql = `
      INSERT INTO PHIEUDANGKY (MA_PHIEUDANGKY, NGAYLAP, TRANGTHAI_THANHTOAN, NV_LAP, MA_LICHTHI, MA_KH)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    try {
      // Start a transaction to ensure atomicity
      await pool.query('START TRANSACTION');
      
      // Insert the new PhieuDangKy record
      await pool.query(sql, [
        MA_PHIEUDANGKY,
        NGAYLAP,
        TRANGTHAI_THANHTOAN,
        NV_LAP,
        MA_LICHTHI,
        MA_KH,
      ]);

      // Update SOLUONG_DANGKY in LICHTHI
      const updateSql = `
        UPDATE LICHTHI 
        SET SOLUONG_DANGKY = SOLUONG_DANGKY + 1 
        WHERE MA_LICHTHI = ?
      `;
      await pool.query(updateSql, [MA_LICHTHI]);
      // Commit the transaction
      await pool.query('COMMIT');

      return { success: true, message: 'Registration created successfully' };
    } catch (err) {
      await pool.query('ROLLBACK');
      console.error('Error creating PhieuDangKy:', err);
      throw err;
    }
  }
}

export default PhieuDangKy;
