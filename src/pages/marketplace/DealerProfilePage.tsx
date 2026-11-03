import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Calendar,
  Building2,
  Car,
} from 'lucide-react';

export const DealerProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dealer = StorageService.getDealerBySlug(slug || '');
  const [activeTab, setActiveTab] = useState<'inventory' | 'about'>('inventory');

  if (!dealer) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Dealer Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            The dealership you are looking for does not exist or may have been unlisted.
          </p>
          <Link
            to="/dealers"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-[#10151F] text-[#C6F36B] text-xs font-bold"
          >
            Back to Dealerships
          </Link>
        </div>
      </div>
    );
  }

  const vehicles = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-16">
      {/* Dealer Cover Hero */}
      <div className="relative h-64 sm:h-80 bg-slate-950 overflow-hidden">
        <img
          src={dealer.coverImage}
          alt={dealer.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10151F] via-[#10151F]/40 to-transparent"></div>

        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#182231] border-2 border-[#C6F36B] shadow-2xl overflow-hidden shrink-0">
              <img src={dealer.logo} alt={dealer.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{dealer.name}</h1>
                {dealer.verified && (
                  <span className="bg-[#C6F36B] text-[#10151F] text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                    VERIFIED
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">{dealer.tagline}</p>
              <div className="flex items-center gap-3 text-xs text-slate-300 mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#54D7E8]" />
                  {dealer.contact.city}, {dealer.contact.state}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold text-white">{dealer.rating}</span>
                  <span className="text-slate-400 text-[10px]">({dealer.reviewsCount} sample data)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-end">
            <Link
              to={`/showroom/${dealer.slug}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C6F36B] text-[#10151F] font-extrabold text-xs hover:bg-[#b0df57] transition-all shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Branded Showroom Website</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Contact Info & Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[11px]">Showroom Location</span>
            <span className="font-semibold text-slate-800 mt-1 block leading-snug">
              {dealer.contact.address}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[11px]">Direct Phone & WhatsApp</span>
            <a
              href={`tel:${dealer.contact.phone}`}
              className="font-bold text-slate-900 hover:text-blue-600 mt-1 block"
            >
              {dealer.contact.phone}
            </a>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[11px]">Personal Showroom Domain</span>
            <span className="font-mono font-semibold text-blue-600 mt-1 block truncate">
              {dealer.customDomain}
            </span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-400 block text-[11px]">Operating Since</span>
            <span className="font-bold text-slate-900 mt-1 block">
              {dealer.establishedYear} ({2026 - dealer.establishedYear} Years in Business)
            </span>
          </div>
        </div>

        {/* Tab navigation: Inventory vs About */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'inventory'
                ? 'border-[#10151F] text-[#10151F]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Active Inventory ({vehicles.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'about'
                ? 'border-[#10151F] text-[#10151F]'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>About Dealership & Trust</span>
          </button>
        </div>

        {/* Tab 1: Inventory */}
        {activeTab === 'inventory' && (
          <div>
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-xs text-slate-500">No active vehicle listings for this dealer.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: About */}
        {activeTab === 'about' && (
          <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm space-y-6 max-w-4xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dealership Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{dealer.about}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900">Verification & Compliance</h4>
              <p>• GST Registered: {dealer.documentsSubmitted?.gstNumber || '27AABCO1234F1Z8'}</p>
              <p>• Physical dealership verified by Antilog field ops</p>
              <p>• Non-accidental checklist verified on every vehicle</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
