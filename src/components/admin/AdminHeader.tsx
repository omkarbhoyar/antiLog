import React from 'react';
import { Menu, ShieldAlert, Sparkles, Building2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  onToggleMobileMenu: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  onToggleMobileMenu,
}) => {
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
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#182230] leading-tight">
              {title}
            </h1>
            <span className="bg-[#10151F] text-[#54D7E8] text-[10px] font-mono px-2 py-0.5 rounded font-bold">
              SUPER ADMIN
            </span>
          </div>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
        >
          <span>Main Marketplace</span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>
      </div>
    </header>
  );
};
