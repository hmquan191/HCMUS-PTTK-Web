import { pool } from '../database.js';

class ThiSinh {
  async getAllThiSinh() {
    const sql = 
    `SELECT MA_TS, HOTEN, NGAYSINH, GIOITINH, EMAIL, SDT, CCCD, DIACHI
    FROM THISINH
    `;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching ThiSinh:', err);
      throw err;
    }
  }

  async getThiSinhByKhachHang(maKhachHang) {
    const sql = `
      SELECT MA_TS, HOTEN, NGAYSINH, GIOITINH, EMAIL, SDT, CCCD, DIACHI
      FROM THISINH t JOIN KHACHHANG k ON t.MA_KH = k.MA_KH
      WHERE t.MA_KH = ?
    `;
    try {
      const [results] = await pool.query(sql, [maKhachHang]);
      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error('Error fetching ThiSinh by KhachHang:', err);
      throw err;
    }
  }
}

export default ThiSinh;