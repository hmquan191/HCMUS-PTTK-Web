// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // hoặc 'light'
    primary: {
      main: '#ff4757', // xanh lá sẫm
    },
    secondary: {
      main: '#7bed9f', // trắng nhẹ
    },
    background: {
      default: '#ffffff', // đen tuyền
      paper: '#e84118',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
