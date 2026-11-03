import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DealerSidebar } from './DealerSidebar';
import { QuickDemoBar } from '@/components/common/QuickDemoBar';

export const DealerLayout: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans">
      <QuickDemoBar />
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block h-[calc(100vh-28px)] sticky top-7">
          <DealerSidebar />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileSidebarOpen(false)}
            ></div>
            <div className="relative z-10">
              <DealerSidebar onCloseMobile={() => setMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <Outlet context={{ toggleMobileMenu: () => setMobileSidebarOpen(!mobileSidebarOpen) }} />
        </div>
      </div>
    </div>
  );
};
