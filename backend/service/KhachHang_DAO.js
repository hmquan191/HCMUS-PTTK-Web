import { pool } from '../database.js';

class KhachHang {
  async getAllKhachHang() {
    const sql = 
    `SELECT MA_KH, TEN_KH, EMAIL, SDT, LOAI_KH
    FROM KHACHHANG
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
