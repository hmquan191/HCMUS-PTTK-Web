import React, { useState, useEffect } from 'react';
import { Button, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, InputLabel, FormControl, TextField } from '@mui/material';
import axios from 'axios';

// Helper function to format date to dd/mm/yyyy
const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle null or undefined
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const CapChungChi = () => {
  const [phieuDuThiList, setPhieuDuThiList] = useState([]);
  const [selectedPhieuDuThi, setSelectedPhieuDuThi] = useState(null);
  const [maPhieuDuThiInput, setMaPhieuDuThiInput] = useState('');
  const [maChungChiList, setMaChungChiList] = useState([]);
  const [selectedMaChungChi, setSelectedMaChungChi] = useState('');
  const [chungChiList, setChungChiList] = useState([]);
  const [selectedChungChi, setSelectedChungChi] = useState(null);
  const [error, setError] = useState('');

  // Fetch all PhieuDuThi and MA_CHUNGCHI on component mount
  useEffect(() => {
    const fetchPhieuDuThi = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/phieuduthi');
        setPhieuDuThiList(response.data);
      } catch (err) {
        setError('Lỗi khi tải danh sách phiếu dự thi');
        console.error('Error fetching PhieuDuThi:', err);
      }
    };

    const fetchMaChungChi = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/chungchi/list');
        setMaChungChiList(response.data);
      } catch (err) {
        setError('Lỗi khi tải danh sách mã chứng chỉ');
        console.error('Error fetching MA_CHUNGCHI list:', err);
      }
    };

    fetchPhieuDuThi();
    fetchMaChungChi();
  }, []);

  // Handle row selection for PhieuDuThi
  const handleRowSelect = (phieu) => {
    setSelectedPhieuDuThi(phieu);
    setMaPhieuDuThiInput(phieu.MA_PHIEUDUTHI); // Sync input with selected row
  };

  // Handle search by selected MA_PHIEUDUTHI or manual input
  const handleSearchByPhieuDuThi = async () => {
    const maPhieuDuThiToSearch = maPhieuDuThiInput || (selectedPhieuDuThi ? selectedPhieuDuThi.MA_PHIEUDUTHI : '');
    if (!maPhieuDuThiToSearch) {
      setError('Vui lòng chọn hoặc nhập mã phiếu dự thi');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/chungchi/${maPhieuDuThiToSearch}`);
      setChungChiList(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tra cứu chứng chỉ');
      setChungChiList([]);
    }
  };

  // Handle search by selected MA_CHUNGCHI
  const handleSearchByChungChi = async () => {
    if (!selectedMaChungChi) {
      setError('Vui lòng chọn một mã chứng chỉ');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/chungchi/by-code/${selectedMaChungChi}`);
      setChungChiList(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tra cứu chứng chỉ');
      setChungChiList([]);
    }
  };

  // Handle update certificate status
  const handleUpdateStatus = async () => {
    if (!selectedChungChi || selectedChungChi.TRANGTHAINHAN === 'Đã nhận') {
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/chungchi/update/${selectedChungChi.MA_CHUNGCHI}`, {
        newStatus: 'Đã nhận',
      });
      // Refresh the ChungChi list based on the current search method
      if (selectedPhieuDuThi || maPhieuDuThiInput) {
        const response = await axios.get(`http://localhost:5000/api/chungchi/${maPhieuDuThiInput || selectedPhieuDuThi.MA_PHIEUDUTHI}`);
        setChungChiList(response.data);
      } else if (selectedMaChungChi) {
        const response = await axios.get(`http://localhost:5000/api/chungchi/by-code/${selectedMaChungChi}`);
        setChungChiList(response.data);
      }
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tra Cứu Chứng Chỉ
        </Typography>
        {error && <Typography color="error">{error}</Typography>}

        {/* Thông Tin Dự Thi (GridView with Search Input) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Thông Tin Dự Thi
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Mã Phiếu Dự Thi"
              value={maPhieuDuThiInput}
              onChange={(e) => {
                setMaPhieuDuThiInput(e.target.value);
                setSelectedPhieuDuThi(null); // Clear selection when typing
              }}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchByPhieuDuThi}
              disabled={!maPhieuDuThiInput && !selectedPhieuDuThi}
            >
              Tìm Kiếm
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: 'black' }}>
                <TableRow sx={{ '& .MuiTableCell-root': { color: 'white', textAlign: 'center' } }}>
                  <TableCell><strong>Mã Phiếu Dự Thi</strong></TableCell>
                  <TableCell><strong>Lần Gia Hạn</strong></TableCell>
                  <TableCell><strong>Mã Phiếu Đăng Ký</strong></TableCell>
                  <TableCell><strong>Nhân Viên Lập</strong></TableCell>
                  <TableCell><strong>Mã Lịch Thi</strong></TableCell>
                  <TableCell><strong>Ngày Thi</strong></TableCell>
                  <TableCell><strong>Giờ Thi</strong></TableCell>
                  <TableCell><strong>Loại Đánh Giá</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody sx={{ backgroundColor: '#F7F7F7' }}>
                {phieuDuThiList.length > 0 ? (
                  phieuDuThiList.map((phieu) => (
                    <TableRow
                      key={phieu.MA_PHIEUDUTHI}
                      onClick={() => handleRowSelect(phieu)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedPhieuDuThi?.MA_PHIEUDUTHI === phieu.MA_PHIEUDUTHI ? '#FDC95F' : 'inherit',
                      }}
                    >
                      <TableCell>{phieu.MA_PHIEUDUTHI}</TableCell>
                      <TableCell>{phieu.LAN_GIAHAN}</TableCell>
                      <TableCell>{phieu.MA_PHIEUDANGKY}</TableCell>
                      <TableCell>{phieu.NV_LAP}</TableCell>
                      <TableCell>{phieu.MA_LICHTHI}</TableCell>
                      <TableCell>{formatDate(phieu.NGAYTHI)}</TableCell>
                      <TableCell>{phieu.GIOTHI}</TableCell>
                      <TableCell>{phieu.LOAI_DANHGIA}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8}>Không có phiếu dự thi nào</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Tra cứu theo Mã Chứng Chỉ (Dropdown) */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tra cứu theo Mã Chứng Chỉ
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <FormControl fullWidth sx={{ flex: 1 }}>
              <InputLabel id="ma-chung-chi-label">Chọn Mã Chứng Chỉ</InputLabel>
              <Select
                labelId="ma-chung-chi-label"
                value={selectedMaChungChi}
                onChange={(e) => setSelectedMaChungChi(e.target.value)}
                label="Chọn Mã Chứng Chỉ"
              >
                <MenuItem value="">
                  <em>Chọn mã chứng chỉ</em>
                </MenuItem>
                {maChungChiList.map((chungChi) => (
                  <MenuItem key={chungChi.MA_CHUNGCHI} value={chungChi.MA_CHUNGCHI}>
                    {chungChi.MA_CHUNGCHI}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchByChungChi}
              disabled={!selectedMaChungChi}
            >
              Tìm Kiếm
            </Button>
          </Box>
        </Box>

        {/* Thông Tin Chứng Chỉ */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Thông Tin Chứng Chỉ
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: 'black' }}>
                <TableRow sx={{ '& .MuiTableCell-root': { color: 'white', textAlign: 'center' } }}>
                  <TableCell><strong>Mã Chứng Chỉ</strong></TableCell>
                  <TableCell><strong>Tên Chứng Chỉ</strong></TableCell>
                  <TableCell><strong>Kết Quả</strong></TableCell>
                  <TableCell><strong>Điểm Số</strong></TableCell>
                  <TableCell><strong>Ngày Cấp</strong></TableCell>
                  <TableCell><strong>Ngày Hết Hạn</strong></TableCell>
                  <TableCell><strong>Trạng Thái Nhận</strong></TableCell>
                  <TableCell><strong>Khách Hàng</strong></TableCell>
                  <TableCell><strong>Ngày Dự Thi</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {chungChiList.length > 0 ? (
                  chungChiList.map((chungChi) => (
                    <TableRow
                      key={chungChi.MA_CHUNGCHI}
                      onClick={() => handleChungChiRowSelect(chungChi)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedChungChi?.MA_CHUNGCHI === chungChi.MA_CHUNGCHI ? '#FDC95F' : 'inherit',
                      }}
                    >
                      <TableCell>{chungChi.MA_CHUNGCHI}</TableCell>
                      <TableCell>{chungChi.TENCHUNGCHI}</TableCell>
                      <TableCell>{chungChi.KETQUA}</TableCell>
                      <TableCell>{chungChi.DIEMSO}</TableCell>
                      <TableCell>{formatDate(chungChi.NGAYCAP)}</TableCell>
                      <TableCell>{formatDate(chungChi.NGAYHETHAN)}</TableCell>
                      <TableCell>{chungChi.TRANGTHAINHAN}</TableCell>
                      <TableCell>{chungChi.TEN_KH}</TableCell>
                      <TableCell>{formatDate(chungChi.NGAYBYTHI)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>Chưa có thông tin chứng chỉ</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateStatus}
            disabled={!selectedChungChi || selectedChungChi.TRANGTHAINHAN === 'Đã nhận'}
            sx={{ mt: 2 }}
          >
            Cập nhật
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CapChungChi;