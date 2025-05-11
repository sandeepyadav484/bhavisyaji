import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import AppRoutes from './routes/index';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoutes />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
