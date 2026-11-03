import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, ArrowRight, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#10151F] text-slate-400 border-t border-[#233044] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dealer Acquisition Callout */}
        <div className="bg-gradient-to-r from-[#182231] via-[#1a283c] to-[#182231] rounded-2xl p-8 border border-[#233044] relative overflow-hidden mb-16 shadow-2xl">
          <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6F36B]/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#C6F36B]/10 text-[#C6F36B] border border-[#C6F36B]/20 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> For Independent Dealerships
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Launch your branded digital showroom with Antilog OS
              </h3>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Get a dedicated domain (yourcars.com), integrated CRM pipeline, printable QR window stickers, and automatic marketplace distribution starting at ₹799/month.
              </p>
            </div>
            <Link
              to="/dealer/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C6F36B] text-[#10151F] font-bold text-sm hover:bg-[#b0df57] transition-all shrink-0 shadow-[0_0_20px_rgba(198,243,107,0.3)] hover:scale-105"
            >
              <span>Explore Dealer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#233044]/80">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#182231] border border-[#C6F36B]/40 flex items-center justify-center">
                <Car className="w-5 h-5 text-[#C6F36B]" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                ANTI<span className="text-[#C6F36B]">LOG</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The next-generation digital automotive operating system connecting India’s premier verified independent used-car dealers with discerning buyers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-[#182231] px-3 py-1.5 rounded-lg border border-[#233044]">
                <ShieldCheck className="w-4 h-4 text-[#C6F36B]" />
                <span>100% Verified Dealer Network</span>
              </div>
            </div>
          </div>

          {/* Column 1: Marketplace */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/cars" className="hover:text-white transition-colors">Browse All Cars</Link></li>
              <li><Link to="/cars?body=SUV" className="hover:text-white transition-colors">Used SUVs</Link></li>
              <li><Link to="/cars?body=Sedan" className="hover:text-white transition-colors">Premium Sedans</Link></li>
              <li><Link to="/cars?fuel=Electric" className="hover:text-white transition-colors">Electric Vehicles (EVs)</Link></li>
              <li><Link to="/dealers" className="hover:text-white transition-colors">Verified Showrooms</Link></li>
              <li><Link to="/requirements" className="hover:text-white transition-colors">Post Car Requirement</Link></li>
            </ul>
          </div>

          {/* Column 2: Dealerships */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Sample Showrooms</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/showroom/om-cars" className="hover:text-[#C6F36B] transition-colors">OM Cars (Nagpur)</Link></li>
              <li><Link to="/showroom/jay-cars" className="hover:text-[#54D7E8] transition-colors">Jay Cars (Mumbai)</Link></li>
              <li><Link to="/showroom/mansi-cars" className="hover:text-amber-400 transition-colors">Mansi Cars (Pune)</Link></li>
              <li><Link to="/showroom/city-motors" className="hover:text-sky-400 transition-colors">City Motors (Delhi)</Link></li>
              <li><Link to="/showroom/prime-auto-hub" className="hover:text-emerald-400 transition-colors">Prime Auto Hub (BLR)</Link></li>
            </ul>
          </div>

          {/* Column 3: Platform OS */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Dealership SaaS</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/dealer/dashboard" className="text-[#C6F36B] hover:underline font-semibold">Dealer OS Demo</Link></li>
              <li><Link to="/dealer/inventory" className="hover:text-white transition-colors">Inventory Manager</Link></li>
              <li><Link to="/dealer/leads" className="hover:text-white transition-colors">Kanban Lead CRM</Link></li>
              <li><Link to="/dealer/qr-codes" className="hover:text-white transition-colors">Window QR Generator</Link></li>
              <li><Link to="/dealer/subscription" className="hover:text-white transition-colors">SaaS Plans & Pricing</Link></li>
              <li><Link to="/admin/dashboard" className="text-[#54D7E8] hover:underline">Super Admin Portal</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar & Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Antilog Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Illustrative sample dealership & inventory records for prototype review</span>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-slate-400">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
