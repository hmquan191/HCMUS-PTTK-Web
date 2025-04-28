import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { isLoggedIn, logout } = useContext(AuthContext);

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
            <Button color="error" component={Link} to="/" onClick={logout}>
              Đăng Xuất
            </Button>
          </Box>
        ) : null}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
