import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import CompanyList from './pages/CompanyList/CompanyList';
import CompanyDetails from './pages/CompanyDetails/CompanyDetails';
import Login from './pages/Auth/Login';
import RegisterUser from './pages/Auth/RegisterUser';
import RegisterCompany from './pages/Auth/RegisterCompany';
import UserDashboard from './pages/Dashboard/UserDashboard';
import CompanyDashboard from './pages/Dashboard/CompanyDashboard';

// Styles
import './App.css';

// Protected Route komponens
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppContent() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          {/* Publikus útvonalak */}
          <Route path="/" element={<CompanyList />} />
          <Route path="/company/:id" element={<CompanyDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/user" element={<RegisterUser />} />
          <Route path="/register/company" element={<RegisterCompany />} />

          {/* Védett útvonalak - User */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Védett útvonalak - Company */}
          <Route
            path="/dashboard/company"
            element={
              <ProtectedRoute requiredRole="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          {/* 404 - Nem található oldal */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
