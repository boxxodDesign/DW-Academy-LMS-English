import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthGuard } from './components/AuthGuard';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Unauthorized } from './pages/Unauthorized';
import { CoursePlayer } from './pages/CoursePlayer';
import { CourseBuilder } from './pages/CourseBuilder';
import { InstructorDashboard } from './pages/InstructorDashboard';
import { AdminUsers } from './pages/AdminUsers';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route 
          path="/" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } 
        />

        <Route 
          path="/course/:courseId" 
          element={
            <AuthGuard>
              <CoursePlayer />
            </AuthGuard>
          } 
        />

        <Route 
          path="/admin/builder" 
          element={
            <AuthGuard allowedRoles={['Admin']}>
              <CourseBuilder />
            </AuthGuard>
          } 
        />

        <Route 
          path="/admin/users" 
          element={
            <AuthGuard allowedRoles={['Admin']}>
              <AdminUsers />
            </AuthGuard>
          } 
        />

        <Route 
          path="/instructor/reports" 
          element={
            <AuthGuard allowedRoles={['Instructor', 'Admin']}>
              <InstructorDashboard />
            </AuthGuard>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
