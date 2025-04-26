// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // hoặc 'light'
    primary: {
      main: '#F8E79B', // xanh lá sẫm
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
    fontFamily: '"Francois One", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
