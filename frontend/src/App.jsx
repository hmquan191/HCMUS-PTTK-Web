// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TrangChu from './pages/TrangChu';
import TrangDangKy from './pages/TrangDangKy';
import TrangGiaHan from './pages/TrangGiaHan';
import TrangThanhToan from './pages/TrangThanhToan';
import CapChungChi from './pages/CapChungChi';
import TrangDangNhap from './pages/TrangDangNhap';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<TrangDangNhap />} />
        <Route path="/trang-chu" element={<TrangChu />} />
        <Route path="/dang-ky" element={<TrangDangKy />} />
        <Route path="/gia-han" element={<TrangGiaHan />} />
        <Route path="/thanh-toan" element={<TrangThanhToan />} />
        <Route path="/cap-chung-chi" element={<CapChungChi />} />
      </Routes>
    </Router>
  );
}

export default App;
