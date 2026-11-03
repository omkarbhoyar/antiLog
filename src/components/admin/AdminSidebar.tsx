import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  Car,
  CreditCard,
  Sliders,
  Users,
  Settings,
  LogOut,
  ShieldCheck,
  FileCheck,
  AlertOctagon,
} from 'lucide-react';

interface AdminSidebarProps {
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onCloseMobile }) => {
  const { currentUser, switchUser } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Platform Console', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Dealerships Network', to: '/admin/dealers', icon: Building2, badge: '5' },
    { label: 'Listing Moderation', to: '/admin/listings', icon: Car, badge: 'Queue' },
    { label: 'Subscription Plans', to: '/admin/plans', icon: CreditCard },
    { label: 'Marketplace Curation', to: '/admin/marketplace', icon: Sliders },
    { label: 'Platform Customers', to: '/admin/customers', icon: Users },
    { label: 'Central Settings & Logs', to: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B0F17] text-slate-300 flex flex-col justify-between border-r border-[#1F2937] h-full shrink-0 select-none">
      <div>
        {/* Antilog Operations Header */}
        <div className="p-4 border-b border-[#1F2937]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#182231] border border-[#54D7E8]/40 flex items-center justify-center text-[#54D7E8] font-black text-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white flex items-center">
                ANTI<span className="text-[#C6F36B]">LOG</span>
                <span className="ml-1.5 text-[9px] bg-[#54D7E8] text-[#0B0F17] font-black px-1.5 py-0.2 rounded">
                  HQ
                </span>
              </span>
              <p className="text-[10px] text-slate-400">Platform Operations Command</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 text-xs font-semibold">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#54D7E8] text-[#0B0F17] font-extrabold shadow'
                      : 'text-slate-400 hover:text-white hover:bg-[#182231]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold bg-[#182231] text-slate-300">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Admin User Footer */}
      <div className="p-3 border-t border-[#1F2937] bg-[#080B10]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#182231] border border-[#1F2937]">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-7 h-7 rounded-full bg-[#54D7E8] text-[#0B0F17] font-black flex items-center justify-center text-xs shrink-0">
              HQ
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">Super Administrator</p>
              <p className="text-[10px] text-slate-400">admin@antilog.com</p>
            </div>
          </div>
          <button
            onClick={() => {
              switchUser('customer');
              navigate('/');
            }}
            title="Return to Customer Marketplace"
            className="text-slate-400 hover:text-red-400 p-1 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
