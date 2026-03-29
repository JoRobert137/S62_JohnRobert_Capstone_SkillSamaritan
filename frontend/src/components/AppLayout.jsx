import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const AppLayout = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // For public pages (guest), just Header + content + Footer
  if (!isAuthenticated) {
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
