import React from 'react';
import { Routes,Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import LandingPage from './pages/LandingPage';
import TaskForm from './pages/TaskForm';
import TaskFeedPage from './pages/TaskFeedPage';
import TaskDetail from './pages/TaskDetail';

function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/create-task" element={<TaskForm />} />
        <Route path="/tasks" element={<TaskFeedPage />} />
        {/* <Route path="/tasks/:id" element={<TaskDetail />} /> */}
      </Routes>
    </div>
  );
}

export default App;
