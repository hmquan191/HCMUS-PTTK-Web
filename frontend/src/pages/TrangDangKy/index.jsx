import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Autocomplete, Typography } from "@mui/material";

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
/*
  const customers = [
    { id: 1, name: "Nguyễn Văn A", phone: "0907087381", email: "nva@gmail.com", type: "Khách hàng tự do" },
    { id: 2, name: "Trần Thị B", phone: "0907087381", email: "ttb@gmail.com", type: "Khách hàng đơn vị" },
    // thêm dữ liệu khách hàng
  ];

  const examSchedules = [
    { id: 1, date: "2025-05-10", hour: "8:00", type: "Ngoại ngữ", number: 10, room: "C33" },
    { id: 2, date: "2025-05-20", hour: "8:00", type: "Tin học", number: 10, room: "I53" },
    // thêm dữ liệu lịch thi
  ];

  const staffMembers = [
    { id: 1, name: "Lê Thị C" },
    { id: 2, name: "Phạm Văn D" },
    // thêm dữ liệu nhân viên
  ];

  const statuses = [
    { id: "wait", label: "Chờ thanh toán" },
    { id: "paid", label: "Đã thanh toán" },
    // thêm dữ liệu trạng thái
  ];
*/
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

  // Fetch examschedules
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
  const fetchCandidates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/candidates');
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

  const handleSubmit = () => {
    const registrationData = {
      customerId: selectedCustomer?.id,
      examScheduleId: selectedExamSchedule?.id,
      staffId: selectedStaff?.id,
      status: selectedStatus?.id,
    };
    console.log("Dữ liệu lập phiếu:", registrationData);
    // TODO: Gửi API lập phiếu hoặc xử lý theo yêu cầu
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
    <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
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
                <TableCell>{examSchedules.NGAYTHI}</TableCell>
                <TableCell>{examSchedules.GIOTHI}</TableCell>
                <TableCell>{examSchedules.LOAI_DANHGIA}</TableCell>
                <TableCell>{examSchedules.SOLUONG_DANGKY}</TableCell>
                <TableCell>{examSchedules.TEN_PHONG}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" color="primary" sx={{ width: "fit-content" }}>
          Lập Phiếu
        </Button>
      </Box>
    </Box>
  );
}

export default TrangDangKy