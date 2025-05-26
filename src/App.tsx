import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Suppliers from './pages/Suppliers';
import Prices from './pages/Prices';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/prices" element={<Prices />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/\" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;