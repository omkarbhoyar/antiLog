import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import {
  Bell,
  Search,
  Menu,
  ChevronDown,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface DealerHeaderProps {
  title: string;
  subtitle?: string;
  onToggleMobileMenu: () => void;
}

export const DealerHeader: React.FC<DealerHeaderProps> = ({
  title,
  subtitle,
  onToggleMobileMenu,
}) => {
  const { currentUser, switchUser } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [dealerDropdownOpen, setDealerDropdownOpen] = useState(false);

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];
  const allDealers = StorageService.getDealers();

  const notifications = [
    {
      id: 'notif-1',
      title: 'New Online Marketplace Enquiry',
      desc: 'Rohit Kulkarni enquired on 2022 Creta Turbo',
      time: '12m ago',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Upcoming Home Test Drive',
      desc: 'Dr. Vivek Deshpande Thar 4x4 at 11:30 AM',
      time: '45m ago',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'Monthly Subscription Renewed',
      desc: 'Professional Plan renewed via autopay',
      time: '2d ago',
      unread: false,
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between gap-4 sticky top-7 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#182230] leading-tight">
            {title}
          </h1>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Switch Dealership Selector (Multi-Tenant Demo Feature) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setDealerDropdownOpen(!dealerDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{dealer.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {dealerDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                Switch Operating Dealership
              </div>
              {allDealers.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    if (d.id === 'dealer-1') switchUser('dealer_om');
                    else if (d.id === 'dealer-2') switchUser('dealer_jay');
                    setDealerDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 ${
                    d.id === dealer.id ? 'font-bold text-blue-600 bg-blue-50/50' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold">{d.name}</p>
                    <p className="text-[10px] text-slate-400">{d.contact.city}</p>
                  </div>
                  {d.id === dealer.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Showroom Live Link */}
        <a
          href={`/showroom/${dealer.slug}`}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shadow-sm"
        >
          <span>Live Showroom</span>
          <ExternalLink className="w-3 h-3 text-[#C6F36B]" />
        </a>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C6F36B] ring-2 ring-white"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl p-3 z-50 animate-fade-in text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 px-1">
                <span className="font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] font-semibold text-blue-600 cursor-pointer">
                  Mark all as read
                </span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl border transition-colors ${
                      n.unread ? 'bg-blue-50/60 border-blue-100' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-[11px]">{n.title}</p>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
