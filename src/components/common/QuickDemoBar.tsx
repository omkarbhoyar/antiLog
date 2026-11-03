import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { StorageService } from '@/services/storage';
import { ShieldCheck, Store, Car, BarChart3, RotateCcw, ChevronDown, ChevronUp, UserCheck } from 'lucide-react';

export const QuickDemoBar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, switchUser } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleReset = () => {
    if (window.confirm('Reset all demo data back to default initial seed?')) {
      StorageService.resetToDefault();
      success('Demo data reset', 'All vehicles, leads, and appointments restored to pristine initial state.');
    }
  };

  return (
    <div className="bg-[#10151F] text-white border-b border-[#233044] text-xs py-1.5 px-4 sticky top-0 z-[100] shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6F36B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6F36B]"></span>
          </span>
          <span className="font-bold tracking-wider text-[#C6F36B] uppercase text-[11px]">ANTILOG OS</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-300 font-medium hidden md:inline">Experience Switcher:</span>
        </div>

        {!collapsed && (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => {
                switchUser('customer');
                navigate('/');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                location.pathname === '/' || location.pathname.startsWith('/cars')
                  ? 'bg-[#182231] text-[#C6F36B] border border-[#C6F36B]/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#182231]'
              }`}
            >
              <Car className="w-3.5 h-3.5 text-[#C6F36B]" />
              <span>Marketplace</span>
            </button>

            <button
              onClick={() => {
                switchUser('customer');
                navigate('/showroom/om-cars');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                location.pathname.startsWith('/showroom/om-cars')
                  ? 'bg-[#182231] text-[#C6F36B] border border-[#C6F36B]/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#182231]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#54D7E8]" />
              <span>OM Cars Showroom</span>
            </button>

            <button
              onClick={() => {
                switchUser('customer');
                navigate('/showroom/jay-cars');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                location.pathname.startsWith('/showroom/jay-cars')
                  ? 'bg-[#182231] text-[#54D7E8] border border-[#54D7E8]/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-[#182231]'
              }`}
            >
              <Store className="w-3.5 h-3.5 text-[#54D7E8]" />
              <span>Jay Cars Showroom</span>
            </button>

            <button
              onClick={() => {
                switchUser('dealer_om');
                navigate('/dealer/dashboard');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                location.pathname.startsWith('/dealer')
                  ? 'bg-[#C6F36B] text-[#10151F] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#182231]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Dealer Dashboard</span>
            </button>

            <button
              onClick={() => {
                switchUser('super_admin');
                navigate('/admin/dashboard');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all ${
                location.pathname.startsWith('/admin')
                  ? 'bg-[#54D7E8] text-[#10151F] font-bold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#182231]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#182231] px-2 py-0.5 rounded text-[11px] text-slate-300 border border-slate-700">
            <UserCheck className="w-3 h-3 text-[#C6F36B]" />
            <span className="truncate max-w-[100px]">{currentUser.name}</span>
          </div>

          <button
            onClick={handleReset}
            title="Reset sample data"
            className="text-slate-400 hover:text-red-400 p-1 hover:bg-[#182231] rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-400 hover:text-white p-1 hover:bg-[#182231] rounded transition-colors"
          >
            {collapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
