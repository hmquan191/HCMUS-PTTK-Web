import React, { useState } from 'react'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Autocomplete, Typography } from "@mui/material";

const TrangDangKy = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedExamSchedule, setSelectedExamSchedule] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [note, setNote] = useState("");

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
    console.log("Khách hàng đã chọn:", customer);
  };

  const handleSelectExamSchedules = (examSchedules) => {
    setSelectedExamSchedule(examSchedules);
    console.log("Lịch thi đã chọn:", examSchedules);
  };

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
                key={customer.id} 
                hover
                onClick={() => handleSelectCustomer(customer)}
                
                sx={{ 
                  "& .MuiTableCell-root": { textAlign: "center", },
                  cursor: "pointer",
                  backgroundColor: selectedCustomer?.id === customer.id ? "#FDC95F" : "inherit", 
                }}
              >
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.type}</TableCell>
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
                key={examSchedules.id} 
                hover
                onClick={() => handleSelectExamSchedules(examSchedules)}
                
                sx={{ 
                  "& .MuiTableCell-root": { textAlign: "center", },
                  cursor: "pointer",
                  backgroundColor: selectedExamSchedule?.id === examSchedules.id ? "#FDC95F" : "inherit", // màu nền khi chọn
                }}
              >
                <TableCell>{examSchedules.date}</TableCell>
                <TableCell>{examSchedules.hour}</TableCell>
                <TableCell>{examSchedules.type}</TableCell>
                <TableCell>{examSchedules.number}</TableCell>
                <TableCell>{examSchedules.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Autocomplete
        options={staffMembers}
        getOptionLabel={(option) => option.name}
        value={selectedStaff} 
        onChange={(event, value) => setSelectedStaff(value)}
        renderInput={(params) => <TextField {...params} label="Nhân viên lập phiếu" />}
      />

      <Autocomplete
        options={statuses}
        getOptionLabel={(option) => option.label}
        value={selectedStatus} 
        onChange={(event, value) => setSelectedStatus(value)}
        renderInput={(params) => <TextField {...params} label="Trạng thái thanh toán" />}
      />

      <Box sx={{ maxWidth: 800, mx: "auto", textAlign: "center", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Button variant="contained" color="primary" sx={{ width: "fit-content" }}>
          Lập Phiếu
        </Button>
      </Box>
    </Box>
  );
}

export default TrangDangKy