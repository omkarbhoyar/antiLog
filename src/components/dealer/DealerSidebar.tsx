import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import {
  LayoutDashboard,
  Car,
  Users2,
  Calendar,
  QrCode,
  BarChart3,
  UserCheck,
  CreditCard,
  Settings,
  Store,
  LogOut,
  ChevronRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface DealerSidebarProps {
  onCloseMobile?: () => void;
}

export const DealerSidebar: React.FC<DealerSidebarProps> = ({ onCloseMobile }) => {
  const { currentUser, switchUser } = useAuth();
  const navigate = useNavigate();

  // Active dealer
  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const menuItems = [
    { label: 'Overview', to: '/dealer/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', to: '/dealer/inventory', icon: Car, badge: `${dealer.activeListingsCount}` },
    { label: 'Leads CRM', to: '/dealer/leads', icon: Users2, badge: 'Pipeline' },
    { label: 'Appointments', to: '/dealer/appointments', icon: Calendar },
    { label: 'Window QR Codes', to: '/dealer/qr-codes', icon: QrCode },
    { label: 'Performance Analytics', to: '/dealer/analytics', icon: BarChart3 },
    { label: 'Sales Team', to: '/dealer/team', icon: UserCheck },
    { label: 'Branded Storefront', to: '/dealer/storefront', icon: Store },
    { label: 'Subscription & Billing', to: '/dealer/subscription', icon: CreditCard },
    { label: 'Dealership Settings', to: '/dealer/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#10151F] text-slate-300 flex flex-col justify-between border-r border-[#233044] h-full shrink-0 select-none">
      <div>
        {/* Dealership Header Card */}
        <div className="p-4 border-b border-[#233044]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#182231] border border-[#C6F36B]/40 flex items-center justify-center text-[#C6F36B] font-extrabold text-sm overflow-hidden shrink-0">
              <img src={dealer.logo} alt={dealer.name} className="w-full h-full object-cover" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-white text-sm truncate">{dealer.name}</h3>
                {dealer.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C6F36B] shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-400 truncate">{dealer.contact.city} Dealership</p>
            </div>
          </div>

          <Link
            to={`/showroom/${dealer.slug}`}
            target="_blank"
            className="mt-3 flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#182231] hover:bg-[#233044] text-[11px] text-slate-300 hover:text-white transition-colors border border-[#233044]"
          >
            <span className="truncate">{dealer.customDomain}</span>
            <ExternalLink className="w-3 h-3 text-[#54D7E8] shrink-0" />
          </Link>
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
                      ? 'bg-[#C6F36B] text-[#10151F] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#182231]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                      item.to === '/dealer/inventory'
                        ? 'bg-[#182231] text-[#C6F36B]'
                        : 'bg-[#182231] text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Switcher */}
      <div className="p-3 border-t border-[#233044] bg-[#0D121B]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#182231] border border-[#233044]">
          <div className="flex items-center gap-2 overflow-hidden">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-[#C6F36B]/50 shrink-0"
            />
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 capitalize">{currentUser.role.replace('_', ' ')}</p>
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
