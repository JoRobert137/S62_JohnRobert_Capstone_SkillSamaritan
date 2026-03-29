import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const PUBLIC_PATHS = ['/', '/about', '/login', '/signup', '/contact'];

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isPublicRoute = PUBLIC_PATHS.includes(location.pathname);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Public pages should not render the app sidebar.
  if (!isAuthenticated || isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    );
  }

  // For authenticated pages: Header + Sidebar + content + Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
