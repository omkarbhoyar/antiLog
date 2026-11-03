import React from 'react';
import { Outlet } from 'react-router-dom';
import { QuickDemoBar } from './QuickDemoBar';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MarketplaceLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      <QuickDemoBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
