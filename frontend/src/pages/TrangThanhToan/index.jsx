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
  Autocomplete,
} from '@mui/material';

// Helper function to format date to dd/mm/yyyy
const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle null or undefined
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const TrangThanhToan = () => {
  const [registrations, setRegistrations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [paymentData, setPaymentData] = useState({
    MA_PHIEUTHANHTOAN: '',
    NGAYLAP: new Date().toISOString().split('T')[0], // Still send ISO format to API
    TRANGTHAI_THANHTOAN: 'ChuaThanhToan',
    TONGTIEN: '',
    NGAYTHANHTOAN: null,
    GIAMGIA: '0',
    NV_LAP: 'NV001',
    MA_PHIEUDANGKY: '',
    MA_KH: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const statuses = [
    { id: 'Chưa thanh toán', label: 'Chưa thanh toán' },
    { id: 'Đã thanh toán', label: 'Đã thanh toán' },
  ];

  // Fetch registration tickets
  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/registrations');
      const data = await response.json();
      if (response.ok) {
        setRegistrations(data);
      } else {
        showSnackbar('Error fetching registration tickets', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching registration tickets', 'error');
    }
  };

  // Fetch payment tickets
  const fetchPayments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments');
      const data = await response.json();
      if (response.ok) {
        setPayments(data);
      } else {
        showSnackbar('Error fetching payment tickets', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching payment tickets', 'error');
    }
  };

  // Search registration ticket by ID
  const handleSearch = async () => {
    if (!searchId) {
      fetchRegistrations();
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/registrations/${searchId}`);
      const data = await response.json();
      if (response.ok) {
        setRegistrations([data]);
      } else {
        showSnackbar('Registration ticket not found', 'error');
        setRegistrations([]);
      }
    } catch (err) {
      showSnackbar('Error searching registration ticket', 'error');
    }
  };

  // Handle registration selection
  const handleSelectRegistration = (registration) => {
    setSelectedRegistration(registration);
    setPaymentData({
      ...paymentData,
      MA_PHIEUDANGKY: registration.MA_PHIEUDANGKY,
      MA_KH: registration.MA_KH,
    });
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setPaymentData({ ...paymentData, [field]: value });
  };

  // Handle status selection
  const handleStatusChange = (value) => {
    setPaymentData({ ...paymentData, TRANGTHAI_THANHTOAN: value ? value.id : 'ChuaThanhToan' });
  };

  // Handle payment ticket creation
  const handleCreatePayment = async () => {
    const requiredFields = [
      'MA_PHIEUTHANHTOAN',
      'NGAYLAP',
      'TRANGTHAI_THANHTOAN',
      'TONGTIEN',
      'NV_LAP',
      'MA_PHIEUDANGKY',
      'MA_KH',
    ];
    for (const field of requiredFields) {
      if (!paymentData[field]) {
        showSnackbar(`Vui lòng nhập ${field}`, 'error');
        return;
      }
    }

    console.log('Submitting paymentData:', paymentData);

    try {
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      const data = await response.json();
      if (response.ok) {
        showSnackbar('Payment ticket created successfully', 'success');
        setPaymentData({
          MA_PHIEUTHANHTOAN: '',
          NGAYLAP: new Date().toISOString().split('T')[0],
          TRANGTHAI_THANHTOAN: 'ChuaThanhToan',
          TONGTIEN: '',
          NGAYTHANHTOAN: null,
          GIAMGIA: '0',
          NV_LAP: 'NV001',
          MA_PHIEUDANGKY: '',
          MA_KH: '',
        });
        setSelectedRegistration(null);
        fetchPayments();
        fetchRegistrations();
      } else {
        showSnackbar(data.message || 'Error creating payment ticket', 'error');
      }
    } catch (err) {
      showSnackbar('Error creating payment ticket', 'error');
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
    fetchRegistrations();
    fetchPayments();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" textAlign="center">LẬP PHIẾU THANH TOÁN</Typography>

      {/* Search Registration Ticket */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Mã Phiếu Đăng Ký"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Tra Cứu
        </Button>
      </Box>

      {/* Registration Tickets Table */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Danh sách phiếu đăng ký</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'black' }}>
            <TableRow sx={{ '& .MuiTableCell-root': { color: 'white', textAlign: 'center' } }}>
              <TableCell>Mã Phiếu</TableCell>
              <TableCell>Ngày Lập</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Ngày Thi</TableCell>
              <TableCell>Giờ Thi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: '#F7F7F7' }}>
            {registrations.map((registration) => (
              <TableRow
                key={registration.MA_PHIEUDANGKY}
                hover
                onClick={() => handleSelectRegistration(registration)}
                sx={{
                  '& .MuiTableCell-root': { textAlign: 'center' },
                  cursor: 'pointer',
                  backgroundColor:
                    selectedRegistration?.MA_PHIEUDANGKY === registration.MA_PHIEUDANGKY ? '#FDC95F' : 'inherit',
                }}
              >
                <TableCell>{registration.MA_PHIEUDANGKY}</TableCell>
                <TableCell>{formatDate(registration.NGAYLAP)}</TableCell>
                <TableCell>{registration.TRANGTHAI_THANHTOAN}</TableCell>
                <TableCell>{registration.TEN_KH}</TableCell>
                <TableCell>{formatDate(registration.NGAYTHI)}</TableCell>
                <TableCell>{registration.GIOTHI}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Tickets Table */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Danh sách phiếu thanh toán</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'black' }}>
            <TableRow sx={{ '& .MuiTableCell-root': { color: 'white', textAlign: 'center' } }}>
              <TableCell>Mã Phiếu</TableCell>
              <TableCell>Mã Khách Hàng</TableCell>
              <TableCell>Khách Hàng</TableCell>
              <TableCell>Ngày Lập</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Tổng Tiền</TableCell>
              <TableCell>Giảm Giá</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: '#F7F7F7' }}>
            {payments.map((payment) => (
              <TableRow
                key={payment.MA_PHIEUTHANHTOAN}
                sx={{ '& .MuiTableCell-root': { textAlign: 'center' } }}
              >
                <TableCell>{payment.MA_PHIEUTHANHTOAN}</TableCell>
                <TableCell>{payment.MA_KH}</TableCell>
                <TableCell>{payment.TEN_KH}</TableCell>
                <TableCell>{formatDate(payment.NGAYLAP)}</TableCell>
                <TableCell>{payment.TRANGTHAI_THANHTOAN}</TableCell>
                <TableCell>{payment.TONGTIEN}</TableCell>
                <TableCell>{payment.GIAMGIA}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Form */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Thông tin phiếu thanh toán</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Mã Phiếu Thanh Toán"
          value={paymentData.MA_PHIEUTHANHTOAN}
          onChange={(e) => handleInputChange('MA_PHIEUTHANHTOAN', e.target.value)}
          required
        />
        <TextField
          label="Mã Phiếu Đăng Ký"
          value={paymentData.MA_PHIEUDANGKY}
          onChange={(e) => handleInputChange('MA_PHIEUDANGKY', e.target.value)}
          required
          disabled={!!selectedRegistration}
        />
        <TextField
          label="Mã Khách Hàng"
          value={paymentData.MA_KH}
          onChange={(e) => handleInputChange('MA_KH', e.target.value)}
          required
          disabled={!!selectedRegistration}
        />
        <TextField
          label="Tổng Tiền"
          type="number"
          value={paymentData.TONGTIEN}
          onChange={(e) => handleInputChange('TONGTIEN', e.target.value)}
          required
        />
        <TextField
          label="Giảm Giá"
          type="number"
          value={paymentData.GIAMGIA}
          onChange={(e) => handleInputChange('GIAMGIA', e.target.value)}
          placeholder="e.g., 0.1 for 10%"
        />
        <Autocomplete
          options={statuses}
          getOptionLabel={(option) => option.label}
          value={statuses.find((s) => s.id === paymentData.TRANGTHAI_THANHTOAN) || null}
          onChange={(event, value) => handleStatusChange(value)}
          renderInput={(params) => <TextField {...params} label="Trạng Thái Thanh Toán" required />}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ width: 'fit-content', alignSelf: 'center' }}
          onClick={handleCreatePayment}
        >
          Tạo Phiếu
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

export default TrangThanhToan;