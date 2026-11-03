import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dealer } from '@/types/dealer';
import {
  Phone,
  MessageCircle,
  MapPin,
  Car,
  Clock,
  Menu,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface ShowroomNavbarProps {
  dealer: Dealer;
}

export const ShowroomNavbar: React.FC<ShowroomNavbarProps> = ({ dealer }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleWhatsapp = () => {
    const text = encodeURIComponent(`Hello ${dealer.name}, I am visiting your digital showroom and have an inquiry.`);
    window.open(`https://wa.me/${dealer.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <header className="sticky top-7 z-40 bg-[#10151F] text-white border-b border-[#233044] shadow-md">
      {/* Top Utility Bar */}
      <div className="bg-[#0B0F17] text-slate-400 text-[11px] py-1.5 px-4 border-b border-slate-800 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-[#54D7E8]" />
              {dealer.contact.address}, {dealer.contact.city}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-[#C6F36B]" />
              Mon - Sat: 10:00 AM - 08:00 PM
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400">Branded Digital Showroom Powered by</span>
            <Link to="/" className="text-[#C6F36B] font-extrabold hover:underline">
              Antilog OS
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dealer Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Dealership Identity */}
        <Link to={`/showroom/${dealer.slug}`} className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-[#182231] border-2 border-[#C6F36B]/50 p-1 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-[#C6F36B] transition-all">
            <img src={dealer.logo} alt={dealer.name} className="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-lg sm:text-xl text-white tracking-tight leading-tight">
                {dealer.name}
              </h2>
              {dealer.verified && (
                <span title="Verified Dealership">
                  <ShieldCheck className="w-4 h-4 text-[#C6F36B]" />
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
              {dealer.customDomain}
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          <Link
            to={`/showroom/${dealer.slug}`}
            className={`hover:text-[#C6F36B] transition-colors ${
              location.pathname === `/showroom/${dealer.slug}` ? 'text-[#C6F36B]' : 'text-slate-300'
            }`}
          >
            Showroom Home
          </Link>
          <Link
            to={`/showroom/${dealer.slug}/cars`}
            className={`hover:text-[#C6F36B] transition-colors ${
              location.pathname.includes('/cars') ? 'text-[#C6F36B]' : 'text-slate-300'
            }`}
          >
            Our Inventory ({dealer.activeListingsCount})
          </Link>
          <Link
            to={`/showroom/${dealer.slug}/contact`}
            className={`hover:text-[#C6F36B] transition-colors ${
              location.pathname.includes('/contact') ? 'text-[#C6F36B]' : 'text-slate-300'
            }`}
          >
            Visit Us / Contact
          </Link>
        </nav>

        {/* Right Action Contacts */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${dealer.contact.phone}`}
            className="hidden lg:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#182231] border border-[#233044] text-xs font-bold text-white hover:border-slate-500 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#54D7E8]" />
            <span>{dealer.contact.phone}</span>
          </a>

          <button
            onClick={handleWhatsapp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#182231] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#182231] border-b border-[#233044] px-4 py-4 space-y-3 text-xs">
          <Link
            to={`/showroom/${dealer.slug}`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-semibold"
          >
            Showroom Home
          </Link>
          <Link
            to={`/showroom/${dealer.slug}/cars`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-semibold"
          >
            All Inventory ({dealer.activeListingsCount})
          </Link>
          <Link
            to={`/showroom/${dealer.slug}/contact`}
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-white font-semibold"
          >
            Contact & Directions
          </Link>
          <div className="pt-2 border-t border-[#233044]">
            <a
              href={`tel:${dealer.contact.phone}`}
              className="flex items-center gap-2 py-2 text-[#54D7E8] font-bold"
            >
              <Phone className="w-4 h-4" />
              <span>Call Showroom: {dealer.contact.phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
