// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // hoặc 'light'
    primary: {
      main: '#FDC95F', // xanh lá sẫm
    },
    secondary: {
      main: '#FF9549', // trắng nhẹ 
    },
    background: {
      default: '#ffffff', // đen tuyền
      paper: '#FDC95F',
    },
  },
  typography: {
    fontFamily: '"Cal Sans", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
