import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TaskForm from './pages/TaskForm';
import TaskFeedPage from './pages/TaskFeedPage';
import TaskDetail from './pages/TaskDetail';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-task" 
          element={
            <ProtectedRoute>
              <TaskForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks" 
          element={
            <ProtectedRoute>
              <TaskFeedPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tasks/:id" 
          element={
            <ProtectedRoute>
              <TaskDetail />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
