import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import {
  Building2,
  ShieldCheck,
  MapPin,
  Star,
  ArrowRight,
  ExternalLink,
  Phone,
  Search,
} from 'lucide-react';

export const DealersListPage: React.FC = () => {
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');

  const dealers = StorageService.getDealers().filter((d) => {
    if (cityFilter && d.contact.city !== cityFilter) return false;
    if (search && !d.name.toLowerCase().includes(search.toLowerCase()) && !d.contact.city.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Verified Dealerships</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
            Premier Used-Car Dealerships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse registered independent used car dealerships powered by Antilog OS.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search dealer name, city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-slate-500 font-medium">Filter by City:</span>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="">All Cities</option>
              <option value="Nagpur">Nagpur</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Pune">Pune</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Bengaluru">Bengaluru</option>
            </select>
          </div>
        </div>

        {/* Dealers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.map((dealer) => (
            <div
              key={dealer.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-elevated transition-all overflow-hidden flex flex-col group"
            >
              {/* Cover Banner */}
              <div className="relative h-36 overflow-hidden bg-slate-900">
                <img
                  src={dealer.coverImage}
                  alt={dealer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                {dealer.verified && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#10151F]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-[#C6F36B] border border-[#C6F36B]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C6F36B]" />
                    <span>Verified Dealership</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-4 text-white">
                  <span className="text-[10px] uppercase font-mono bg-black/50 px-2 py-0.5 rounded border border-white/20">
                    {dealer.customDomain}
                  </span>
                </div>
              </div>

              {/* Info Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-lg text-[#182230] group-hover:text-blue-600 transition-colors">
                    {dealer.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{dealer.tagline}</p>

                  <div className="flex items-center gap-3 my-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{dealer.rating}</span>
                      <span className="text-slate-400 text-[10px]">({dealer.reviewsCount} sample reviews)</span>
                    </div>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {dealer.contact.city}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dealer.about}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700">
                    {dealer.activeListingsCount} Active Cars
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dealers/${dealer.slug}`}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      to={`/showroom/${dealer.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shadow-sm"
                    >
                      <span>Showroom</span>
                      <ArrowRight className="w-3 h-3 text-[#C6F36B]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
