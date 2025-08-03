import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import { Routes,Route } from 'react-router-dom';
import LoginForm from './components/LoginForm'; // Assuming you have a LoginPage component
import LandingPage from './LandingPage';
function App() {
  return (
    <div>
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;
