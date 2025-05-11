import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ChatPage } from './pages/ChatPage';
import CreditPackagesPage from './pages/CreditPackagesPage';
import TransactionsPage from './pages/TransactionsPage';
import HoroscopePage from './pages/HoroscopePage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/buy-credits" element={<CreditPackagesPage />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/horoscope" element={<HoroscopePage />} />
      {/* Add other routes here as needed */}
    </Routes>
  );
};

export default AppRoutes; 