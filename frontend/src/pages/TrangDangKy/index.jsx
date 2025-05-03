import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TextField, TableRow, Paper, Typography, Snackbar, Alert } from "@mui/material";

const TrangDangKy = () => {
  //Biến lưu
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedExamSchedule, setSelectedExamSchedule] = useState(null);
  //Danh sách
  const [customers, setCustomers] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [registrationData, setRegistrationData] = useState({
    MA_PHIEUDANGKY: '',
    NGAYLAP: new Date().toISOString().split('T')[0],
    TRANGTHAI_THANHTOAN: 'Chờ thanh toán', // Default to non-null value
    NV_LAP: 'NV001', // Replace with logged-in staff ID in production
    MA_LICHTHI: '',
    MA_KH: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers');
      const data = await response.json();
      if (response.ok) {
        setCustomers(data);
      } else {
        showSnackbar('Error fetching customers', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching customers', 'error');
    }
  };

  // Fetch exam schedules
  const fetchExamSchedules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/schedules');
      const data = await response.json();
      if (response.ok) {
        setExamSchedules(data);
      } else {
        showSnackbar('Error fetching exam schedules', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching exam schedules', 'error');
    }
  };

  // Fetch registrations
  const fetchRegistrations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/registrations');
      const data = await response.json();
      if (response.ok) {
        setRegistrations(data);
      } else {
        showSnackbar('Error fetching registrations', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching registrations', 'error');
    }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setRegistrationData({
      ...registrationData,
      MA_KH: customer.MA_KH,
    });
    console.log("Khách hàng đã chọn:", customer);
  };

  const handleSelectExamSchedules = (examSchedules) => {
    setSelectedExamSchedule(examSchedules);
    setRegistrationData({
      ...registrationData,
      MA_LICHTHI: examSchedules.MA_LICHTHI,
    });
    console.log("Lịch thi đã chọn:", examSchedules);
  };

  // Handle registration creation
  const handleCreateRegistration = async () => {
    // Validate required fields
    const requiredFields = [
      'MA_PHIEUDANGKY',
      'NGAYLAP',
      'TRANGTHAI_THANHTOAN',
      'NV_LAP',
      'MA_LICHTHI',
      'MA_KH',
    ];
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        showSnackbar(`Vui lòng nhập ${field}`, 'error');
        return;
      }
    }

    // Log paymentData for debugging
    console.log('Submitting registrationData:', registrationData);

    try {
      const response = await fetch('http://localhost:5000/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });
      const data = await response.json();
      if (response.ok) {
        showSnackbar('Registration created successfully', 'success');
        setRegistrationData({
          MA_PHIEUDANGKY: '',
          NGAYLAP: new Date().toISOString().split('T')[0],
          TRANGTHAI_THANHTOAN: 'Chờ thanh toán', // Default to non-null value
          NV_LAP: 'NV001', // Replace with logged-in staff ID in production
          MA_LICHTHI: '',
          MA_KH: '',
        });
        setSelectedCustomer(null);
        setSelectedExamSchedule(null);
        fetchCustomers(); // Refresh customer list
        fetchExamSchedules(); // Refresh exam schedule list
        fetchRegistrations();
      } else {
        showSnackbar(data.message || 'Error creating registration', 'error');
      }
    } catch (err) {
      showSnackbar('Error creating registration', 'error');
    }
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setRegistrationData({ ...registrationData, [field]: value });
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
    fetchCustomers();
    fetchExamSchedules();
    fetchRegistrations();
  }, []);

  return (
    <Box sx={{ maxWidth: 1000, mx: "auto", textAlign: "center", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" textAlign="center">LẬP PHIẾU ĐĂNG KÝ</Typography>
      {/* Bảng danh sách khách hàng */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Danh sách khách hàng</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "black" }}>
            <TableRow sx={{"& .MuiTableCell-root": { color: "white", textAlign: "center", } }}>
              <TableCell>ID</TableCell>
              <TableCell>Tên khách hàng</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Loại khách hàng</TableCell>
              <TableCell>Số lượng thí sinh</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#F7F7F7" }}>
            {customers.map((customer) => (
              <TableRow 
                key={customer.MA_KH} 
                hover
                onClick={() => handleSelectCustomer(customer)}
                
                sx={{ 
                  "& .MuiTableCell-root": { textAlign: "center", },
                  cursor: "pointer",
                  backgroundColor: selectedCustomer?.MA_KH === customer.MA_KH ? "#FDC95F" : "inherit", 
                }}
              >
                <TableCell>{customer.MA_KH}</TableCell>
                <TableCell>{customer.TEN_KH}</TableCell>
                <TableCell>{customer.SDT}</TableCell>
                <TableCell>{customer.EMAIL}</TableCell>
                <TableCell>{customer.LOAI_KH}</TableCell>
                <TableCell>{customer.soLuongThiSinh}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bảng danh sách lịch thi */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Danh sách lịch thi</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "black" }}>
            <TableRow sx={{"& .MuiTableCell-root": { color: "white", textAlign: "center", } }}>
              <TableCell>Ngày thi</TableCell>
              <TableCell>Giờ thi</TableCell>
              <TableCell>Loại đánh giá</TableCell>
              <TableCell>Số lượng đăng ký</TableCell>
              <TableCell>Phòng thi</TableCell>
              <TableCell>Sức chứa</TableCell>
              <TableCell>Địa điểm</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#F7F7F7" }}>
            {examSchedules.map((examSchedules) => (
              <TableRow 
                key={examSchedules.MA_LICHTHI} 
                hover
                onClick={() => handleSelectExamSchedules(examSchedules)}
                
                sx={{ 
                  "& .MuiTableCell-root": { textAlign: "center", },
                  cursor: "pointer",
                  backgroundColor: selectedExamSchedule?.MA_LICHTHI === examSchedules.MA_LICHTHI ? "#FDC95F" : "inherit", // màu nền khi chọn
                }}
              >
                <TableCell>{new Date(examSchedules.NGAYTHI).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{examSchedules.GIOTHI}</TableCell>
                <TableCell>{examSchedules.LOAI_DANHGIA}</TableCell>
                <TableCell>{examSchedules.SOLUONG_DANGKY}</TableCell>
                <TableCell>{examSchedules.TEN_PHONG}</TableCell>
                <TableCell>{examSchedules.SUCCHUA}</TableCell>
                <TableCell>{examSchedules.DIADIEM}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bảng danh sách phiếu đăng ký */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Danh sách phiếu đăng ký</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "black" }}>
            <TableRow sx={{"& .MuiTableCell-root": { color: "white", textAlign: "center", } }}>
              <TableCell>Mã phiếu đăng ký</TableCell>
              <TableCell>Ngày lập phiếu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Nhân viên lập</TableCell>
              <TableCell>Mã khách hàng</TableCell>
              <TableCell>Mã lịch thi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#F7F7F7" }}>
            {registrations.map((registrations) => (
              <TableRow 
                key={registrations.MA_PHIEUDANGKY} 
                sx={{ 
                  "& .MuiTableCell-root": { textAlign: "center", }}}
              >
                <TableCell>{registrations.MA_PHIEUDANGKY}</TableCell>
                <TableCell>{new Date(registrations.NGAYLAP).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{registrations.TRANGTHAI_THANHTOAN}</TableCell>
                <TableCell>{registrations.NV_LAP}</TableCell>
                <TableCell>{registrations.MA_KH}</TableCell>
                <TableCell>{registrations.MA_LICHTHI}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TextField
        label="Mã phiếu đăng ký"
        value={registrationData.MA_PHIEUDANGKY}
        onChange={(e) => handleInputChange('MA_PHIEUDANGKY', e.target.value)}
        required
      />
      
      <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" color="primary" sx={{ width: "fit-content" }} onClick={handleCreateRegistration}>
          Lập Phiếu
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
}

export default TrangDangKy