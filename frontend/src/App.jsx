// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import TrangChu from './pages/TrangChu';
import TrangDangKy from './pages/TrangDangKy';
import TrangGiaHan from './pages/TrangGiaHan';
import TrangThanhToan from './pages/TrangThanhToan';
import CapChungChi from './pages/CapChungChi';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/dang-ky" element={<TrangDangKy />} />
        <Route path="/gia-han" element={<TrangGiaHan />} />
        <Route path="/thanh-toan" element={<TrangThanhToan />} />
        <Route path="/cap-chung-chi" element={<CapChungChi />} />
      </Routes>
    </Router>
  );
}

export default App;
