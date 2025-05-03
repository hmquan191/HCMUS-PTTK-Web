// frontend/src/pages/TrangGiaHan.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';

const TrangGiaHan = () => {
  const [examTickets, setExamTickets] = useState([]); // PHIEUDUTHI (all tickets)
  const [filteredExamTickets, setFilteredExamTickets] = useState([]); // Filtered tickets based on search
  const [renewalTickets, setRenewalTickets] = useState([]); // PHIEUGIAHAN
  const [selectedExamTicket, setSelectedExamTicket] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [renewalData, setRenewalData] = useState({
    MA_PHIEUGIAHAN: '',
    LYDO_GIAHAN: '',
    NGAYLAP: new Date().toISOString().split('T')[0],
    TINHTRANG_THANHTOAN: 'ChuaThanhToan',
    PHIGIAHAN: '',
    NV_LAP: 'NV001', // Replace with logged-in staff ID in production
    MA_PHIEUDUTHI: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isEligible, setIsEligible] = useState(null); // To store eligibility status

  // Format date to dd/mm/yy
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Fetch exam tickets (PHIEUDUTHI)
  const fetchExamTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pdt');
      const data = await response.json();
      if (response.ok) {
        setExamTickets(data);
        setFilteredExamTickets(data); // Initially, filtered list is the same as the full list
      } else {
        showSnackbar('Error fetching exam tickets', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching exam tickets', 'error');
    }
  };

  // Fetch renewal tickets (PHIEUGIAHAN)
  const fetchRenewalTickets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/renewals');
      const data = await response.json();
      if (response.ok) {
        setRenewalTickets(data);
      } else {
        showSnackbar('Error fetching renewal tickets', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching renewal tickets', 'error');
    }
  };

  // Handle search input change and filter exam tickets in real-time
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchId(value);

    if (!value) {
      setFilteredExamTickets(examTickets); // Reset to full list if search is empty
      return;
    }

    // Filter exam tickets based on MA_PHIEUDUTHI using match
    const filtered = examTickets.filter((ticket) =>
      ticket.MA_PHIEUDUTHI.toLowerCase().match(value.toLowerCase())
    );

    if (filtered.length === 0) {
      showSnackbar('No matching exam tickets found', 'info');
    }

    setFilteredExamTickets(filtered);
  };

  // Check renewal eligibility
  const checkRenewalEligibility = async (maPhieuDuThi) => {
    try {
      const response = await fetch(`http://localhost:5000/api/renewal/check/${maPhieuDuThi}`);
      const data = await response.json();
      if (response.ok) {
        setIsEligible(data);
        if (!data.canRenew) {
          showSnackbar(data.message, 'error');
        }
      } else {
        showSnackbar('Error checking renewal eligibility', 'error');
        setIsEligible(null);
      }
    } catch (err) {
      showSnackbar('Error checking renewal eligibility', 'error');
      setIsEligible(null);
    }
  };

  // Handle exam ticket selection
  const handleSelectExamTicket = (examTicket) => {
    setSelectedExamTicket(examTicket);
    setRenewalData({
      ...renewalData,
      MA_PHIEUDUTHI: examTicket.MA_PHIEUDUTHI,
    });
    checkRenewalEligibility(examTicket.MA_PHIEUDUTHI); // Check eligibility when selecting
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setRenewalData({ ...renewalData, [field]: value });
  };

  // Handle renewal ticket creation
  const handleCreateRenewal = async () => {
    // Validate required fields
    const requiredFields = [
      'MA_PHIEUGIAHAN',
      'LYDO_GIAHAN',
      'NGAYLAP',
      'TINHTRANG_THANHTOAN',
      'PHIGIAHAN',
      'NV_LAP',
      'MA_PHIEUDUTHI',
    ];
    for (const field of requiredFields) {
      if (!renewalData[field]) {
        showSnackbar(`Vui lòng nhập ${field}`, 'error');
        return;
      }
    }

    // Check if eligible for renewal
    if (!isEligible?.canRenew) {
      showSnackbar('This exam ticket is not eligible for renewal', 'error');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/renewal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(renewalData),
      });
      const data = await response.json();
      if (response.ok) {
        showSnackbar('Renewal ticket created successfully', 'success');
        setRenewalData({
          MA_PHIEUGIAHAN: '',
          LYDO_GIAHAN: '',
          NGAYLAP: new Date().toISOString().split('T')[0],
          TINHTRANG_THANHTOAN: 'ChuaThanhToan',
          PHIGIAHAN: '',
          NV_LAP: 'NV001',
          MA_PHIEUDUTHI: '',
        });
        setSelectedExamTicket(null);
        setIsEligible(null);
        fetchRenewalTickets(); // Refresh renewal list
        fetchExamTickets(); // Refresh exam ticket list
      } else {
        showSnackbar(data.message || 'Error creating renewal ticket', 'error');
      }
    } catch (err) {
      showSnackbar('Error creating renewal ticket', 'error');
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchExamTickets();
    fetchRenewalTickets();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" textAlign="center">
        LẬP PHIẾU GIA HẠN
      </Typography>

      {/* Search Exam Ticket */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Mã Phiếu Dự Thi"
          value={searchId}
          onChange={handleSearch} // Call handleSearch directly on change
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Exam Tickets Table */}
      <Typography variant="h6" textAlign="left" mb={0.25}>
        Danh sách phiếu dự thi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'black' }}>
            <TableRow sx={{ '& .MuiTableCell-root': { color: 'white', textAlign: 'center' } }}>
              <TableCell>Mã Phiếu Dự Thi</TableCell>
              <TableCell>Mã Phiếu Đăng Ký</TableCell>
              <TableCell>Ngày Thi</TableCell>
              <TableCell>Giờ Thi</TableCell>
              <TableCell>Lần Gia Hạn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: '#F7F7F7' }}>
            {filteredExamTickets.map((ticket) => (
              <TableRow
                key={ticket.MA_PHIEUDUTHI}
                hover
                onClick={() => handleSelectExamTicket(ticket)}
                sx={{
                  '& .MuiTableCell-root': { textAlign: 'center' },
                  cursor: 'pointer',
                  backgroundColor:
                    selectedExamTicket?.MA_PHIEUDUTHI === ticket.MA_PHIEUDUTHI ? '#FDC95F' : 'inherit',
                }}
              >
                <TableCell>{ticket.MA_PHIEUDUTHI}</TableCell>
                <TableCell>{ticket.MA_PHIEUDANGKY}</TableCell>
                <TableCell>{formatDate(ticket.NGAYTHI)}</TableCell>
                <TableCell>{ticket.GIOTHI}</TableCell>
                <TableCell>{ticket.LAN_GIAHAN}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Renewal Tickets Table */}
      <Typography variant="h6" textAlign="left" mb={0.25}>
        Danh sách phiếu gia hạn
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'black' }}>
            <TableRow sx={{ '& .MuiTableCell-root': { color: 'white', textAlign: 'center' } }}>
              <TableCell>Mã Phiếu Gia Hạn</TableCell>
              <TableCell>Mã Phiếu Dự Thi</TableCell>
              <TableCell>Lý Do Gia Hạn</TableCell>
              <TableCell>Ngày Lập</TableCell>
              <TableCell>Trạng Thái Thanh Toán</TableCell>
              <TableCell>Phí Gia Hạn</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: '#F7F7F7' }}>
            {renewalTickets.map((renewal) => (
              <TableRow
                key={renewal.MA_PHIEUGIAHAN}
                sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}
              >
                <TableCell>{renewal.MA_PHIEUGIAHAN}</TableCell>
                <TableCell>{renewal.MA_PHIEUDUTHI}</TableCell>
                <TableCell>{renewal.LYDO_GIAHAN}</TableCell>
                <TableCell>{formatDate( renewal.NGAYLAP)}</TableCell>
                <TableCell>{renewal.TINHTRANG_THANHTOAN}</TableCell>
                <TableCell>{renewal.PHIGIAHAN}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Renewal Form */}
      <Typography variant="h6" textAlign="left" mb={0.25}>
        Thông tin phiếu gia hạn
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Mã Phiếu Gia Hạn"
          value={renewalData.MA_PHIEUGIAHAN}
          onChange={(e) => handleInputChange('MA_PHIEUGIAHAN', e.target.value)}
          required
        />
        <TextField
          label="Mã Phiếu Dự Thi"
          value={renewalData.MA_PHIEUDUTHI}
          onChange={(e) => handleInputChange('MA_PHIEUDUTHI', e.target.value)}
          required
          disabled={!!selectedExamTicket} // Disable if an exam ticket is selected
        />
        <TextField
          label="Lý Do Gia Hạn"
          value={renewalData.LYDO_GIAHAN}
          onChange={(e) => handleInputChange('LYDO_GIAHAN', e.target.value)}
          required
        />
        <TextField
          label="Phí Gia Hạn"
          type="number"
          value={renewalData.PHIGIAHAN}
          onChange={(e) => handleInputChange('PHIGIAHAN', e.target.value)}
          required
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 'fit-content', alignSelf: 'center' }}
          onClick={handleCreateRenewal}
          disabled={!isEligible?.canRenew} // Disable if not eligible
        >
          Tạo Phiếu Gia Hạn
        </Button>
      </Box>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TrangGiaHan;