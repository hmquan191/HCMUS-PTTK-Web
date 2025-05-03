import { pool } from '../database.js';

class KhachHang {
  async getAllKhachHang() {
    const sql = 
    `
    SELECT 
      KH.MA_KH, 
      KH.TEN_KH, 
      KH.EMAIL, 
      KH.SDT, 
      KH.LOAI_KH,
      COUNT(TS.MA_TS) AS soLuongThiSinh
    FROM KHACHHANG KH
    JOIN THISINH TS ON KH.MA_KH = TS.MA_KH
    GROUP BY KH.MA_KH, KH.TEN_KH, KH.EMAIL, KH.SDT, KH.LOAI_KH
    `;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching KhachHang:', err);
      throw err;
    }
  }
}

export default KhachHang;
