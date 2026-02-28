/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import BreathTests from './pages/BreathTests';
import FoodHub from './pages/FoodHub';
import Education from './pages/Education';
import NIHEvidence from './pages/NIHEvidence';
import SiboSuccess from './pages/SiboSuccess';
import Settings from './pages/Settings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/home" replace /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />
      <Route path="/verify-email" element={user ? <Navigate to="/home" replace /> : <VerifyEmail />} />
      <Route path="/forgot-password" element={user ? <Navigate to="/home" replace /> : <ForgotPassword />} />
      <Route path="/reset-password" element={user ? <Navigate to="/home" replace /> : <ResetPassword />} />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/login" replace />} />
      
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/breath-tests" element={<BreathTests />} />
        <Route path="/food-hub" element={<FoodHub />} />
        <Route path="/education" element={<Education />} />
        <Route path="/nih-evidence" element={<NIHEvidence />} />
        <Route path="/sibo-success" element={<SiboSuccess />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
