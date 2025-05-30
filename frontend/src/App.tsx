import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TimeEntry from './pages/TimeEntry';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import Reports from './pages/Reports';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timesheet" 
              element={
                <ProtectedRoute>
                  <TimeEntry />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <RoleProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/manager" 
              element={
                <RoleProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
                  <ManagerDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;