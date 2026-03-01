/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';

const Layout = React.lazy(() => import('./components/Layout'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const VerifyEmail = React.lazy(() => import('./pages/VerifyEmail'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/ResetPassword'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Home = React.lazy(() => import('./pages/Home'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const BreathTests = React.lazy(() => import('./pages/BreathTests'));
const FoodHub = React.lazy(() => import('./pages/FoodHub'));
const Education = React.lazy(() => import('./pages/Education'));
const NIHEvidence = React.lazy(() => import('./pages/NIHEvidence'));
const SiboSuccess = React.lazy(() => import('./pages/SiboSuccess'));
const Settings = React.lazy(() => import('./pages/Settings'));

const RouteFallback = () => (
  <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
    <span className="text-sm text-slate-400">Loading...</span>
  </div>
);

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <RouteFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (!user.hasCompletedOnboarding) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <Signup />} />
        <Route path="/verify-email" element={user ? <Navigate to="/home" replace /> : <VerifyEmail />} />
        <Route path="/forgot-password" element={user ? <Navigate to="/home" replace /> : <ForgotPassword />} />
        <Route path="/reset-password" element={user ? <Navigate to="/home" replace /> : <ResetPassword />} />
        <Route
          path="/onboarding"
          element={loading ? <RouteFallback /> : (user ? <Onboarding /> : <Navigate to="/login" replace />)}
        />

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
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
     <Router basename={import.meta.env.BASE_URL}>
    <AppRoutes />
  </Router>

    </AuthProvider>
  );
}
