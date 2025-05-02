import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';

const CapChungChi = () => {
  const [maPhieuDuThi, setMaPhieuDuThi] = useState('');
  const [maChungChi, setMaChungChi] = useState('');
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState('');

  const handleSearchByPhieuDuThi = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates/${maPhieuDuThi}`);
      setCertificate(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tra cứu chứng chỉ');
      setCertificate(null);
    }
  };

  const handleSearchByChungChi = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/certificates/by-code/${maChungChi}`);
      setCertificate(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tra cứu chứng chỉ');
      setCertificate(null);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tra Cứu Chứng Chỉ
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        
        {/* Search by MA_PHIEUDUTHI */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tra cứu theo Mã Phiếu Dự Thi
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Mã Phiếu Dự Thi"
              variant="outlined"
              value={maPhieuDuThi}
              onChange={(e) => setMaPhieuDuThi(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchByPhieuDuThi}
              disabled={!maPhieuDuThi}
            >
              Tìm Kiếm
            </Button>
          </Box>
        </Box>

        {/* Search by MA_CHUNGCHI */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Tra cứu theo Mã Chứng Chỉ
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              label="Mã Chứng Chỉ"
              variant="outlined"
              value={maChungChi}
              onChange={(e) => setMaChungChi(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchByChungChi}
              disabled={!maChungChi}
            >
              Tìm Kiếm
            </Button>
          </Box>
        </Box>

        {/* Display Certificate Information */}
        {certificate && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Thông Tin Chứng Chỉ
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Mã Chứng Chỉ</strong></TableCell>
                    <TableCell><strong>Tên Chứng Chỉ</strong></TableCell>
                    <TableCell><strong>Kết Quả</strong></TableCell>
                    <TableCell><strong>Điểm Số</strong></TableCell>
                    <TableCell><strong>Ngày Cấp</strong></TableCell>
                    <TableCell><strong>Ngày Hết Hạn</strong></TableCell>
                    <TableCell><strong>Trạng Thái Nhận</strong></TableCell>
                    <TableCell><strong>Khách Hàng</strong></TableCell>
                    <TableCell><strong>Ngày Thi</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{certificate.MA_CHUNGCHI}</TableCell>
                    <TableCell>{certificate.TENCHUNGCHI}</TableCell>
                    <TableCell>{certificate.KETQUA}</TableCell>
                    <TableCell>{certificate.DIEMSO}</TableCell>
                    <TableCell>{certificate.NGAYCAP}</TableCell>
                    <TableCell>{certificate.NGAYHETHAN}</TableCell>
                    <TableCell>{certificate.TRANGTHAINHAN}</TableCell>
                    <TableCell>{certificate.TEN_KH}</TableCell>
                    <TableCell>{certificate.EXAM_DATE}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CapChungChi;