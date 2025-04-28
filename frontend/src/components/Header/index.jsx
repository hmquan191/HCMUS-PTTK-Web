import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập từ localStorage
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Xóa thông tin đăng nhập và cập nhật lại trạng thái
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          ACCI
        </Typography>

        {isLoggedIn ? (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Button color="inherit" component={Link} to="/trang-chu">
              Trang Chủ
            </Button>
            <Button color="inherit" component={Link} to="/dang-ky">
              Lập Phiếu Đăng Ký
            </Button>
            <Button color="inherit" component={Link} to="/gia-han">
              Lập Phiếu Gia Hạn
            </Button>
            <Button color="inherit" component={Link} to="/thanh-toan">
              Lập Phiếu Thanh Toán
            </Button>
            <Button color="inherit" component={Link} to="/cap-chung-chi">
              Tra Cứu Chứng Chỉ
            </Button>
            <Button color="error" component={Link} to="/" onClick={handleLogout}>
              Đăng Xuất
            </Button>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
