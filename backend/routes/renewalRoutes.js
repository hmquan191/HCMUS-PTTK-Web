import express from 'express';
import PhieuGiaHan_DAO from '../service/gia_han_DAO.js'; // Import the DAO class

const renewalRouter = express.Router();
// Renewal API - Check eligibility
renewalRouter.get('/renewal/check/:maPhieuDuThi', async (req, res) => {
    const { maPhieuDuThi } = req.params;
    const phieuGiaHanDAO = new PhieuGiaHan_DAO();

    try {
        const eligibility = await phieuGiaHanDAO.kiemTraDKGiaHan(maPhieuDuThi);
        res.status(200).json(eligibility);
        } catch (err) {
        res.status(500).json({ message: 'Error checking renewal eligibility' });
    }
});

// Renewal API - Create a new renewal
renewalRouter.post('/renewal', async (req, res) => {
    const phieuGiaHanDAO = new PhieuGiaHan_DAO();
    const phieuGiaHan = req.body;

    try {
        const result = await phieuGiaHanDAO.createPhieuGiaHan(phieuGiaHan);
        res.status(201).json(result);
        } 
        catch (err) {
            res.status(500).json({ message: 'Error creating renewal' });
        }
});

export default renewalRouter;