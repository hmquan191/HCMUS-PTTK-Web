import { pool } from '../database.js';

class ThiSinh {
  async getThiSinhByKhachHang(maKhachHang) {
    const sql = `
      SELECT t.MA_TS, t.HOTEN, t.NGAYSINH, t.GIOITINH, t.EMAIL, t.SDT, t.CCCD, t.DIACHI
      FROM THISINH t JOIN KHACHHANG k ON t.MA_KH = k.MA_KH
      WHERE t.MA_KH = ?
    `;
    try {
      const [results] = await pool.query(sql, [maKhachHang]);
      return results;
    } catch (err) {
      console.error('Error fetching ThiSinh by KhachHang:', err);
      throw err;
    }
  }
}

export default ThiSinh;