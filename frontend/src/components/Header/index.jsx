import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';



const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Trang Quản Lý
        </Typography>


        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Button color='inherit' component={Link} to="/">
            Trang Chủ
          </Button>
          <Button color="inherit" component={Link} to="/dang-ky">
            Đăng Ký
          </Button>
          <Button color="inherit" component={Link} to="/gia-han">
            Gia Hạn
          </Button>
          <Button color="inherit" component={Link} to="/thanh-toan">
            Thanh Toán
          </Button>
          <Button color="inherit" component={Link} to="/cap-chung-chi">
            Cấp Chứng Chỉ
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
