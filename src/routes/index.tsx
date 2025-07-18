import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import AuthPage from '../pages/AuthPage';
import ProfilePage from '../pages/ProfilePage';
import ConsultationPage from '../pages/ConsultationPage';
import NotFoundPage from '../pages/NotFoundPage';
import AuthGuard from '../components/auth/AuthGuard';
import OnboardingPage from '../pages/OnboardingPage';
import PersonaDirectoryPage from '../pages/PersonaDirectoryPage';
import PersonaDetailPage from '../pages/PersonaDetailPage';
import HoroscopePage from '../pages/HoroscopePage';
import AuthOnboardingPage from '../pages/AuthOnboardingPage';
import { ChatPage } from '../pages/ChatPage';
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage';
import DeleteAccountPage from '../pages/DeleteAccountPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/auth-onboarding" element={<AuthOnboardingPage />} />
      <Route path="/" element={<MainLayout><Outlet /></MainLayout>}>
        <Route index element={<AuthGuard><HomePage /></AuthGuard>} />
        <Route path="auth" element={<AuthPage />} />
        <Route path="onboarding" element={<OnboardingPage />} />
        <Route path="personas" element={<PersonaDirectoryPage />} />
        <Route path="personas/:id" element={<PersonaDetailPage />} />
        <Route path="profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
        <Route path="consultation" element={<AuthGuard><ConsultationPage /></AuthGuard>} />
        <Route path="horoscope" element={<HoroscopePage />} />
        <Route path="chat/:personaId" element={<AuthGuard><ChatPage /></AuthGuard>} />
        <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="delete-account" element={<AuthGuard><DeleteAccountPage /></AuthGuard>} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 