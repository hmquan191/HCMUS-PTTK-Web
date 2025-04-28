import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TrangDangNhap = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Gửi request đến backend để kiểm tra đăng nhập
      const response = await axios.post('http://localhost:5000/', {
        username,
        password,
      });

      if (response.status === 200) {
        // Lưu trạng thái đăng nhập vào localStorage
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Chuyển hướng đến trang chính (trang-chu)
        navigate('/trang-chu');
      }
    } catch (error) {
      setError('Tên tài khoản hoặc mật khẩu không đúng');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Đăng Nhập
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Tên tài khoản"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Box>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Đăng Nhập
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default TrangDangNhap;
