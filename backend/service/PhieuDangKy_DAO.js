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
      // Insert the new PhieuDangKy record
      await pool.query(sql, [
        MA_PHIEUDANGKY,
        NGAYLAP,
        TRANGTHAI_THANHTOAN,
        NV_LAP,
        MA_LICHTHI,
        MA_KH,
      ]);
/*
      // Update SOLUONG_DANGKY in LICHTHI
      const updateSql = `
        UPDATE LICHTHI 
        SET SOLUONG_DANGKY = SOLUONG_DANGKY + 1 
        WHERE MA_LICHTHI = ?
      `;
      await pool.query(updateSql, [MA_LICHTHI]);
*/
      return { success: true, message: 'Registration created successfully' };
    } catch (err) {
      console.error('Error creating PhieuDangKy:', err);
      throw err;
    }
  }
}

export default PhieuDangKy;
