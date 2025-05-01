import { pool } from '../database.js'; // Import the pool from database.js

class PhieuGiaHan_DAO {
  constructor() {
    this.connection = pool; // Use the imported pool directly
  }

  // No need for Connect/Disconnect since the pool manages connections
  // Execute a query using the pool
  async ExecuteQuery(sql) {
    try {
      const [results] = await this.connection.query(sql);
      return results;
    } catch (err) {
      console.error('Error executing query:', err);
      throw err;
    }
  }

  // Retrieve renewal information for a given MA_PHIEUDUTHI
  async LayThongTinPhieuGiaHan(maPhieuDuThi) {
    const sql = `
      SELECT * FROM PHIEUGIAHAN 
      WHERE MA_PHIEUDUTHI = ?
    `;
    try {
      const [results] = await this.connection.query(sql, [maPhieuDuThi]);
      return results.length > 0 ? results[0] : null;
    } catch (err) {
      console.error('Error retrieving PhieuGiaHan:', err);
      throw err;
    }
  }

  // Check if a PhieuDuThi can be renewed (e.g., check if it exists and is eligible)
  async kiemTraDKGiaHan(maPhieuDuThi) {
    const sql = `
      SELECT p.MA_PHIEUDUTHI, p.LAN_GIAHAN, l.NGAYTHI
      FROM PHIEUDUTHI p
      JOIN LICHTHI l ON p.MA_LICHTHI = l.MA_LICHTHI
      WHERE p.MA_PHIEUDUTHI = ?
    `;
    try {
      const [results] = await this.connection.query(sql, [maPhieuDuThi]);

      if (results.length === 0) {
        return { canRenew: false, message: 'PhieuDuThi not found' };
      }

      const phieuDuThi = results[0];
      const maxRenewals = 3; // Example: Maximum 3 renewals
      const today = new Date();
      const examDate = new Date(phieuDuThi.NGAYTHI);

      if (phieuDuThi.LAN_GIAHAN >= maxRenewals) {
        return { canRenew: false, message: 'Maximum renewals reached' };
      }

      if (today > examDate) {
        return { canRenew: false, message: 'Exam date has passed' };
      }

      return { canRenew: true, message: 'Eligible for renewal' };
    } catch (err) {
      console.error('Error checking renewal eligibility:', err);
      throw err;
    }
  }

  // Create a new PhieuGiaHan (renewal record)
  async createPhieuGiaHan(phieuGiaHan) {
    const { MA_PHIEUGIAHAN, LYDO_GIAHAN, NGAYLAP, TINHTRANG_THANHTOAN, PHIGIAHAN, NV_LAP, MA_PHIEUDUTHI } = phieuGiaHan;
    const sql = `
      INSERT INTO PHIEUGIAHAN (MA_PHIEUGIAHAN, LYDO_GIAHAN, NGAYLAP, TINHTRANG_THANHTOAN, PHIGIAHAN, NV_LAP, MA_PHIEUDUTHI)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    try {
      // Insert the new PhieuGiaHan record
      await this.connection.query(sql, [
        MA_PHIEUGIAHAN,
        LYDO_GIAHAN,
        NGAYLAP,
        TINHTRANG_THANHTOAN,
        PHIGIAHAN,
        NV_LAP,
        MA_PHIEUDUTHI,
      ]);

      // Update LAN_GIAHAN in PHIEUDUTHI
      const updateSql = `
        UPDATE PHIEUDUTHI 
        SET LAN_GIAHAN = LAN_GIAHAN + 1 
        WHERE MA_PHIEUDUTHI = ?
      `;
      await this.connection.query(updateSql, [MA_PHIEUDUTHI]);

      return { success: true, message: 'Renewal created successfully' };
    } catch (err) {
      console.error('Error creating PhieuGiaHan:', err);
      throw err;
    }
  }
}

export default PhieuGiaHan_DAO;