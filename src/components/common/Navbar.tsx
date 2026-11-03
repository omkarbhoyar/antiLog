import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { StorageService } from '@/services/storage';
import {
  Car,
  Heart,
  MapPin,
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  FileText,
  Calendar,
  LogOut,
  Building2,
  Sparkles,
} from 'lucide-react';

const CITIES = ['All Cities', 'Nagpur', 'Mumbai', 'Pune', 'New Delhi', 'Bengaluru'];

export const Navbar: React.FC = () => {
  const { currentUser, logout, switchUser } = useAuth();
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const favCount = StorageService.getFavorites().length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cars?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/cars');
    }
  };

  return (
    <header className="sticky top-7 z-40 bg-[#10151F]/95 backdrop-blur-md border-b border-[#233044] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#182231] to-[#233044] border border-[#C6F36B]/40 flex items-center justify-center shadow-[0_0_15px_rgba(198,243,107,0.2)] group-hover:border-[#C6F36B] transition-all">
            <Car className="w-5 h-5 text-[#C6F36B]" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center">
              ANTI<span className="text-[#C6F36B]">LOG</span>
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono -mt-1">
              Automotive OS
            </span>
          </div>
        </Link>

        {/* City Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsCityOpen(!isCityOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#182231] border border-[#233044] text-xs font-medium text-slate-200 hover:border-slate-500 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#54D7E8]" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isCityOpen && (
            <div className="absolute left-0 mt-1.5 w-44 rounded-xl bg-[#182231] border border-[#233044] shadow-xl py-1 z-50 animate-fade-in">
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setIsCityOpen(false);
                    if (city === 'All Cities') {
                      navigate('/cars');
                    } else {
                      navigate(`/cars?city=${encodeURIComponent(city)}`);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between ${
                    selectedCity === city
                      ? 'text-[#C6F36B] font-semibold bg-[#233044]'
                      : 'text-slate-300 hover:bg-[#233044]/60'
                  }`}
                >
                  <span>{city}</span>
                  {selectedCity === city && <span className="w-1.5 h-1.5 rounded-full bg-[#C6F36B]"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Bar (Marketplace wide) */}
        <form onSubmit={handleSearchSubmit} className="hidden lg:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search make, model, e.g. Creta, Thar, Fortuner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#182231]/80 border border-[#233044] rounded-xl pl-9 pr-16 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C6F36B] focus:ring-1 focus:ring-[#C6F36B] transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1.5 top-1 px-2.5 py-1 rounded-lg bg-[#C6F36B] text-[#10151F] text-[11px] font-bold hover:bg-[#b0df57] transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
          <Link
            to="/cars"
            className={`hover:text-[#C6F36B] transition-colors ${
              location.pathname === '/cars' ? 'text-[#C6F36B] font-semibold' : 'text-slate-300'
            }`}
          >
            Browse Cars
          </Link>
          <Link
            to="/dealers"
            className={`hover:text-[#C6F36B] transition-colors ${
              location.pathname === '/dealers' ? 'text-[#C6F36B] font-semibold' : 'text-slate-300'
            }`}
          >
            Verified Dealers
          </Link>
          <Link
            to="/requirements"
            className="flex items-center gap-1.5 text-slate-300 hover:text-[#54D7E8] transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#54D7E8]" />
            <span>Post Requirement</span>
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Favorites */}
          <Link
            to="/favorites"
            className="relative p-2 rounded-lg bg-[#182231] border border-[#233044] text-slate-300 hover:text-red-400 hover:border-red-400/30 transition-all"
            title="Saved Cars"
          >
            <Heart className="w-4 h-4" />
            {favCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favCount}
              </span>
            )}
          </Link>

          {/* User Profile / Login */}
          {currentUser.role === 'customer' ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-[#182231] border border-[#233044] hover:border-slate-500 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-full object-cover border border-[#C6F36B]/50"
                />
                <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#182231] border border-[#233044] shadow-2xl py-2 z-50 animate-fade-in text-xs">
                  <div className="px-4 py-2 border-b border-[#233044]">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                  <Link
                    to="/my-enquiries"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-[#233044] hover:text-white transition-colors"
                  >
                    <FileText className="w-4 h-4 text-[#54D7E8]" />
                    <span>My Enquiries</span>
                  </Link>
                  <Link
                    to="/my-appointments"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-[#233044] hover:text-white transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-[#C6F36B]" />
                    <span>My Test Drives</span>
                  </Link>
                  <Link
                    to="/favorites"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:bg-[#233044] hover:text-white transition-colors"
                  >
                    <Heart className="w-4 h-4 text-red-400" />
                    <span>Saved Vehicles ({favCount})</span>
                  </Link>
                  <div className="border-t border-[#233044] my-1 pt-1">
                    <button
                      onClick={() => {
                        switchUser('dealer_om');
                        setIsProfileOpen(false);
                        navigate('/dealer/dashboard');
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-[#C6F36B] hover:bg-[#233044] transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Switch to Dealer Mode</span>
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-[#233044] transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/dealer/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#C6F36B] text-[#10151F] font-bold text-xs hover:bg-[#b0df57] shadow-sm transition-all"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Dealer OS</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#182231] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#182231] border-b border-[#233044] px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search car, model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#10151F] border border-[#233044] rounded-lg pl-9 pr-3 py-2 text-xs text-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <div className="flex flex-col gap-2 pt-2 border-t border-[#233044] text-sm">
            <Link
              to="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 py-1.5"
            >
              Browse All Cars
            </Link>
            <Link
              to="/dealers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 py-1.5"
            >
              Verified Dealers
            </Link>
            <Link
              to="/requirements"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#54D7E8] py-1.5"
            >
              Post Requirement
            </Link>
            <Link
              to="/favorites"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 py-1.5"
            >
              Favorites ({favCount})
            </Link>
            <Link
              to="/dealer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#C6F36B] py-1.5 font-semibold"
            >
              Open Dealer Operating System
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
