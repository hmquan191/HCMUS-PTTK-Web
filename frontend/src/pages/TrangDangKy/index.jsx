import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Snackbar, Alert } from "@mui/material";

const TrangDangKy = () => {
  //Biến lưu
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedExamSchedule, setSelectedExamSchedule] = useState(null);
  //Danh sách
  const [customers, setCustomers] = useState([]);
  const [examSchedules, setExamSchedules] = useState([]);
  const [candidates, setCandidates] = useState([]);

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

  // Fetch candidates
  const fetchCandidates = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/candidates?customerId=${customerId}`);
      const data = await response.json();
      if (response.ok) {
        setCandidates(data);
      } else {
        showSnackbar('Error fetching candidates', 'error');
      }
    } catch (err) {
      showSnackbar('Error fetching candidates', 'error');
    }
  };  

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setRegistrationData({
      ...registrationData,
      MA_KH: customer.MA_KH,
    });
    console.log("Khách hàng đã chọn:", customer);
    fetchCandidates(customer.MA_KH);
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
      } else {
        showSnackbar(data.message || 'Error creating registration', 'error');
      }
    } catch (err) {
      showSnackbar('Error creating registration', 'error');
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
    fetchCustomers();
    fetchExamSchedules();
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Bảng danh sách thí sinh */}
      <Typography variant="h6" textAlign="left" mb={0.25}>Danh sách thí sinh</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "black" }}>
            <TableRow sx={{"& .MuiTableCell-root": { color: "white", textAlign: "center", } }}>
              <TableCell>Mã thí sinh</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Ngày sinh</TableCell>
              <TableCell>Giới tính</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>CCCD</TableCell>
              <TableCell>Địa chỉ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody sx={{ backgroundColor: "#F7F7F7" }}>
            {candidates.map((candidates) => (
              <TableRow 
                key={candidates.MA_LICHTHI} 
                sx={{ 
                  "& .MuiTableCell-root": { textAlign: "center", }}}
              >
                <TableCell>{candidates.MA_TS}</TableCell>
                <TableCell>{candidates.HOTEN}</TableCell>
                <TableCell>{new Date(candidates.NGAYSINH).toLocaleDateString("vi-VN")}</TableCell>
                <TableCell>{candidates.GIOITINH}</TableCell>
                <TableCell>{candidates.EMAIL}</TableCell>
                <TableCell>{candidates.SDT}</TableCell>
                <TableCell>{candidates.CCCD}</TableCell>
                <TableCell>{candidates.DIACHI}</TableCell>
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