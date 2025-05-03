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

      // Truy vấn để đếm số lượng thí sinh thuộc MA_KH
      const countThiSinhSql = `
        SELECT COUNT(*) AS soLuongThiSinh
        FROM THISINH
        WHERE MA_KH = ?
      `;

      // Cập nhật số lượng đăng ký trong LICHTHI dựa trên số lượng thí sinh
      const updateSql = `
        UPDATE LICHTHI 
        SET SOLUONG_DANGKY = SOLUONG_DANGKY + ?
        WHERE MA_LICHTHI = ?
      `;
      // 2. Đếm số lượng thí sinh thuộc MA_KH
      const [countResult] = await pool.query(countThiSinhSql, [MA_KH]);
      const soLuongThiSinh = countResult[0].soLuongThiSinh;

      // 3. Cập nhật SOLUONG_DANGKY trong LICHTHI
      await pool.query(updateSql, [soLuongThiSinh, MA_LICHTHI]);

      return { success: true, message: 'Registration created successfully' };
    } catch (err) {
      console.error('Error creating PhieuDangKy:', err);
      throw err;
    }
  }

  async getAllPhieuDangKy() {
    const sql = `SELECT * FROM PHIEUDANGKY`;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching PhieuDangKy:', err);
      throw err;
    }
  }
}

export default PhieuDangKy;
