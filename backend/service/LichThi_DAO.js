import { pool } from '../database.js';

class LichThi {
  async getAllLichThi() {
    const sql = 
    `
    SELECT l.MA_LICHTHI, l.NGAYTHI, l.GIOTHI, l.LOAI_DANHGIA, l.SOLUONG_DANGKY, p.TEN_PHONG
    FROM LICHTHI l JOIN PHONGTHI p ON l.MA_PHONG = p.MA_PHONG
    `;
    try {
      const [results] = await pool.query(sql);
      return results;
    } catch (err) {
      console.error('Error fetching LICHTHI:', err);
      throw err;
    }
  }
}

export default LichThi;
