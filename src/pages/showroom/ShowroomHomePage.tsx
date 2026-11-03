import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { ShowroomNavbar } from '@/components/showroom/ShowroomNavbar';
import { ShowroomFooter } from '@/components/showroom/ShowroomFooter';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { formatPriceINR } from '@/utils/formatters';
import {
  Search,
  ShieldCheck,
  Star,
  MapPin,
  Car,
  CheckCircle2,
  Phone,
  MessageCircle,
  ArrowRight,
  Clock,
  Award,
  Sparkles,
} from 'lucide-react';

export const ShowroomHomePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBody, setSelectedBody] = useState('');

  const dealer = StorageService.getDealerBySlug(slug || '');

  if (!dealer) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Showroom Not Found</h2>
          <p className="text-xs text-slate-500 mt-2">
            No dealership matches this slug: <code>{slug}</code>.
          </p>
          <Link
            to="/dealers"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-[#10151F] text-[#C6F36B] text-xs font-bold"
          >
            Explore Other Showrooms
          </Link>
        </div>
      </div>
    );
  }

  // Only this dealer's inventory
  const dealerVehicles = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);
  const featuredVehicles = dealerVehicles.filter((v) => v.isFeatured);
  const recentArrivals = dealerVehicles.slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (selectedBody) params.append('body', selectedBody);
    navigate(`/showroom/${dealer.slug}/cars?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
      <div>
        <ShowroomNavbar dealer={dealer} />

        {/* 1. DEALER HERO SECTION */}
        <section className="relative bg-[#10151F] text-white overflow-hidden py-16 sm:py-24 border-b border-[#233044]">
          {/* Cover image backdrop */}
          <div className="absolute inset-0 z-0">
            <img
              src={dealer.coverImage}
              alt={dealer.name}
              className="w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#10151F] via-[#10151F]/90 to-[#10151F]/70"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl space-y-4 mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#182231] border border-[#C6F36B]/30 text-xs font-semibold text-[#C6F36B]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Certified Pre-Owned Specialist in {dealer.contact.city}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {dealer.theme.customWelcomeMessage || `Welcome to ${dealer.name}`}
              </h1>

              <p className="text-slate-300 text-sm leading-relaxed">
                {dealer.about}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{dealer.rating} Rating</span>
                </span>
                <span>•</span>
                <span>{dealer.activeListingsCount} Inspected Cars in Stock</span>
                <span>•</span>
                <span>Established in {dealer.establishedYear}</span>
              </div>
            </div>

            {/* Inventory Search Bar */}
            <div className="max-w-3xl bg-[#182231]/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-[#233044] shadow-2xl">
              <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    placeholder={`Search within ${dealer.name} inventory (e.g. Creta, Thar, Diesel...)`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#10151F] border border-[#233044] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#C6F36B]"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>

                <select
                  value={selectedBody}
                  onChange={(e) => setSelectedBody(e.target.value)}
                  className="w-full sm:w-44 bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6F36B]"
                >
                  <option value="">All Categories</option>
                  <option value="SUV">SUVs</option>
                  <option value="Sedan">Sedans</option>
                  <option value="Hatchback">Hatchbacks</option>
                  <option value="Luxury">Luxury</option>
                </select>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#C6F36B] text-[#10151F] font-bold text-xs hover:bg-[#b0df57] transition-all shrink-0"
                >
                  Search Stock
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 2. FEATURED CARS IN THIS SHOWROOM */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Showroom Highlights
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230] mt-1">
                Featured Vehicles at {dealer.name}
              </h2>
            </div>
            <Link
              to={`/showroom/${dealer.slug}/cars`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>View All {dealerVehicles.length} Cars</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(featuredVehicles.length > 0 ? featuredVehicles : recentArrivals.slice(0, 3)).map(
              (vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              )
            )}
          </div>
        </section>

        {/* 3. WHY BUY FROM THIS DEALER */}
        <section className="py-14 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                Why Buy From {dealer.name}?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                We make buying a pre-owned vehicle as transparent and reliable as a new car.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10151F] text-[#C6F36B] flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Strict 150-Point Inspection
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Every car is examined for chassis alignment, engine health, flood damage, and diagnostic fault codes before admission to our lot.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10151F] text-[#54D7E8] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Guaranteed RC Transfer
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We handle complete RTO title transfer, NOC clearances, and loan hypothecation cancellation end-to-end.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#10151F] text-amber-400 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Doorstep Test Drive
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Can’t visit our showroom immediately? Request a home test drive anywhere in {dealer.contact.city} through our online booking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SHOWROOM LOCATION & CONTACT STRIP */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#10151F] rounded-3xl p-8 sm:p-12 text-white border border-[#233044] shadow-2xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl space-y-3">
                <span className="text-xs font-bold text-[#C6F36B] uppercase tracking-wider">
                  Showroom Address
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Visit {dealer.name} in {dealer.contact.city}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  📍 {dealer.contact.address}, {dealer.contact.city}, {dealer.contact.state} - {dealer.contact.pincode}
                </p>
                <div className="pt-2 flex items-center gap-4 text-xs text-slate-300">
                  <span>📞 {dealer.contact.phone}</span>
                  <span>•</span>
                  <span>💬 WhatsApp Available</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <a
                  href={`tel:${dealer.contact.phone}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C6F36B] text-[#10151F] font-extrabold text-xs hover:bg-[#b0df57] transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Dealership</span>
                </a>
                <Link
                  to={`/showroom/${dealer.slug}/contact`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#182231] border border-[#233044] text-white hover:border-slate-500 font-extrabold text-xs transition-colors text-center"
                >
                  View Map & Hours
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ShowroomFooter dealer={dealer} />
    </div>
  );
};
