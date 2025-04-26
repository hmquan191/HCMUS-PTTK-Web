import React, { useState } from 'react'
import { Box, Button, TextField, Autocomplete, Typography } from "@mui/material";

const TrangDangKy = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedExamSchedule, setSelectedExamSchedule] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [note, setNote] = useState("");

  const customers = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    // thêm dữ liệu khách hàng
  ];

  const examSchedules = [
    { id: 1, date: "2025-05-10", description: "Thi tiếng Anh A2" },
    { id: 2, date: "2025-05-20", description: "Thi Tin học Cơ bản" },
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
      note: note,
    };
    console.log("Dữ liệu lập phiếu:", registrationData);
    // TODO: Gửi API lập phiếu hoặc xử lý theo yêu cầu
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" textAlign="center">LẬP PHIẾU ĐĂNG KÝ</Typography>
      <Autocomplete
        options={customers}
        getOptionLabel={(option) => option.name}
        value={selectedCustomer} 
        onChange={(event, value) => setSelectedCustomer(value)}
        renderInput={(params) => <TextField {...params} label="Chọn khách hàng" />}
      />

      <Autocomplete
        options={examSchedules}
        getOptionLabel={(option) => `${option.date} - ${option.description}`}
        value={selectedExamSchedule} 
        onChange={(event, value) => setSelectedExamSchedule(value)}
        renderInput={(params) => <TextField {...params} label="Chọn lịch thi" />}
      />

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

      <TextField
        label="Ghi chú"
        multiline
        rows={3}
        value={note}
        //onChange={(e) => setNote(e.target.value)}
      />
      <Button variant="contained" color="primary">
        Lập Phiếu
      </Button>
    </Box>
  );
}

export default TrangDangKy