import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { formatPriceINR } from '@/utils/formatters';
import {
  Search,
  ShieldCheck,
  CheckCircle,
  Building2,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Flame,
  Award,
  Star,
  Compass,
  FileCheck,
  HelpCircle,
  Car,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

const POPULAR_BRANDS = [
  { name: 'Hyundai', count: 6, logo: 'H' },
  { name: 'Mahindra', count: 5, logo: 'M' },
  { name: 'Toyota', count: 4, logo: 'T' },
  { name: 'Tata', count: 5, logo: 'T' },
  { name: 'Maruti Suzuki', count: 5, logo: 'S' },
  { name: 'BMW', count: 2, logo: 'B' },
  { name: 'Mercedes-Benz', count: 2, logo: 'M' },
  { name: 'Kia', count: 4, logo: 'K' },
];

const BUDGET_RANGES = [
  { label: 'Under ₹5 Lakh', min: 0, max: 500000 },
  { label: '₹5L - ₹10 Lakh', min: 500000, max: 1000000 },
  { label: '₹10L - ₹15 Lakh', min: 1000000, max: 1500000 },
  { label: '₹15L - ₹25 Lakh', min: 1500000, max: 2500000 },
  { label: '₹25L - ₹50 Lakh', min: 2500000, max: 5000000 },
  { label: 'Luxury Above ₹50L', min: 5000000, max: 20000000 },
];

const BODY_TYPES = [
  { name: 'SUV', count: 18, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&auto=format&fit=crop&q=80' },
  { name: 'Sedan', count: 6, image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=400&auto=format&fit=crop&q=80' },
  { name: 'Hatchback', count: 4, image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80' },
  { name: 'MUV', count: 4, image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&auto=format&fit=crop&q=80' },
  { name: 'Luxury', count: 5, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&auto=format&fit=crop&q=80' },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [selectedBody, setSelectedBody] = useState('');

  const allVehicles = StorageService.getVehicles().filter((v) => v.status === 'available');
  const featuredVehicles = allVehicles.filter((v) => v.isFeatured).slice(0, 6);
  const recentVehicles = allVehicles.slice(0, 6);
  const dealers = StorageService.getDealers();

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedMake) params.append('make', selectedMake);
    if (selectedCity) params.append('city', selectedCity);
    if (selectedFuel) params.append('fuel', selectedFuel);
    if (selectedBody) params.append('body', selectedBody);
    if (selectedBudget) {
      const b = BUDGET_RANGES.find((x) => x.label === selectedBudget);
      if (b) {
        params.append('minPrice', b.min.toString());
        params.append('maxPrice', b.max.toString());
      }
    }
    navigate(`/cars?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#10151F] text-white overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-[#233044]">
        {/* Futuristic glowing ambient background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-gradient-to-r from-[#C6F36B]/10 via-[#54D7E8]/10 to-transparent blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute -top-24 right-0 w-96 h-96 bg-[#54D7E8]/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#182231] border border-[#C6F36B]/30 text-xs text-[#C6F36B] font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>India’s Next-Gen Multi-Dealer Automotive Operating System</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              Discover Certified Used Cars from <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C6F36B] to-[#54D7E8]">Verified Dealerships</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Browse thoroughly inspected pre-owned vehicles listed directly by top-rated independent dealerships across Nagpur, Mumbai, Pune, Delhi NCR, and Bengaluru.
            </p>
          </div>

          {/* MAIN SEARCH PANEL */}
          <div className="max-w-4xl mx-auto bg-[#182231]/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border border-[#233044] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <form onSubmit={handleHeroSearch} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Brand / Make */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Make / Brand</label>
                  <select
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6F36B]"
                  >
                    <option value="">All Brands</option>
                    <option value="Hyundai">Hyundai</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Tata">Tata</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Kia">Kia</option>
                    <option value="Volkswagen">Volkswagen</option>
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Budget</label>
                  <select
                    value={selectedBudget}
                    onChange={(e) => setSelectedBudget(e.target.value)}
                    className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6F36B]"
                  >
                    <option value="">Any Budget</option>
                    {BUDGET_RANGES.map((b) => (
                      <option key={b.label} value={b.label}>{b.label}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6F36B]"
                  >
                    <option value="">All Cities</option>
                    <option value="Nagpur">Nagpur</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Body Type</label>
                  <select
                    value={selectedBody}
                    onChange={(e) => setSelectedBody(e.target.value)}
                    className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C6F36B]"
                  >
                    <option value="">All Body Types</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="MUV">MUV</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              {/* Shortcuts and Search Trigger */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#233044]">
                {/* Fuel shortcuts */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Fuel:</span>
                  {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((fuel) => (
                    <button
                      key={fuel}
                      type="button"
                      onClick={() => setSelectedFuel(selectedFuel === fuel ? '' : fuel)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                        selectedFuel === fuel
                          ? 'bg-[#C6F36B] text-[#10151F] font-bold border-[#C6F36B]'
                          : 'bg-[#10151F] text-slate-300 border-[#233044] hover:border-slate-500'
                      }`}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-gradient-to-r from-[#C6F36B] to-[#b4ec4b] text-[#10151F] font-extrabold text-xs hover:shadow-[0_0_20px_rgba(198,243,107,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4 text-[#10151F]" />
                  <span>Find Available Cars</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12 text-center text-xs">
            <div className="p-3 bg-[#182231]/60 rounded-xl border border-[#233044]">
              <p className="text-xl sm:text-2xl font-extrabold text-[#C6F36B]">{allVehicles.length}+</p>
              <p className="text-slate-400 mt-0.5">Verified Vehicles</p>
            </div>
            <div className="p-3 bg-[#182231]/60 rounded-xl border border-[#233044]">
              <p className="text-xl sm:text-2xl font-extrabold text-[#54D7E8]">{dealers.length}</p>
              <p className="text-slate-400 mt-0.5">Premier Dealerships</p>
            </div>
            <div className="p-3 bg-[#182231]/60 rounded-xl border border-[#233044]">
              <p className="text-xl sm:text-2xl font-extrabold text-white">150-Point</p>
              <p className="text-slate-400 mt-0.5">Transparent Inspection</p>
            </div>
            <div className="p-3 bg-[#182231]/60 rounded-xl border border-[#233044]">
              <p className="text-xl sm:text-2xl font-extrabold text-white">₹0</p>
              <p className="text-slate-400 mt-0.5">Customer Brokerage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. POPULAR BRANDS */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-[#182230]">Explore by Popular Brands</h2>
              <p className="text-xs text-slate-500">Trusted manufacturers with high resale value</p>
            </div>
            <Link to="/cars" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <span>View All Brands</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {POPULAR_BRANDS.map((brand) => (
              <Link
                key={brand.name}
                to={`/cars?make=${encodeURIComponent(brand.name)}`}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-400 hover:shadow-md transition-all text-center group bg-slate-50/50 hover:bg-white"
              >
                <div className="w-10 h-10 rounded-full bg-[#182231] text-[#C6F36B] font-extrabold text-sm flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <h4 className="font-bold text-xs text-slate-800 truncate">{brand.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">{brand.count} Cars</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED VEHICLES */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md mb-2">
                <Flame className="w-3.5 h-3.5 text-emerald-600" /> Handpicked Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                Featured Vehicles Available Today
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Top condition Grade A+ vehicles with full service histories & immediate delivery
              </p>
            </div>
            <Link
              to="/cars"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>Explore All {allVehicles.length} Vehicles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. VERIFIED DEALERSHIP NETWORK */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-md mb-2">
                <Building2 className="w-3.5 h-3.5 text-blue-600" /> Digital Showrooms
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                Browse by Verified Independent Dealership
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Every dealer on Antilog operates an independent digital showroom with their own dedicated domain.
              </p>
            </div>
            <Link
              to="/dealers"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <span>View All Showrooms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <div
                key={dealer.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-elevated transition-all overflow-hidden flex flex-col group"
              >
                {/* Cover Image */}
                <div className="relative h-32 overflow-hidden bg-slate-900">
                  <img
                    src={dealer.coverImage}
                    alt={dealer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  {dealer.verified && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#10151F]/90 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold text-[#C6F36B] border border-[#C6F36B]/30">
                      <ShieldCheck className="w-3 h-3 text-[#C6F36B]" />
                      <span>Verified Dealer</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 text-white">
                    <span className="text-[10px] uppercase font-mono text-slate-300">
                      Domain: {dealer.customDomain}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-[#182230] group-hover:text-blue-600 transition-colors">
                      {dealer.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{dealer.tagline}</p>

                    <div className="flex items-center gap-3 my-3 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold">{dealer.rating}</span>
                        <span className="text-slate-400 text-[10px]">({dealer.reviewsCount} sample)</span>
                      </div>
                      <span>•</span>
                      <span>{dealer.contact.city}</span>
                      <span>•</span>
                      <span>Est. {dealer.establishedYear}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {dealer.about}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
                    <span className="text-xs font-semibold text-slate-700">
                      {dealer.activeListingsCount} Available Cars
                    </span>
                    <Link
                      to={`/showroom/${dealer.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shadow-sm"
                    >
                      <span>Visit Showroom</span>
                      <ArrowRight className="w-3 h-3 text-[#C6F36B]" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. BROWSE BY BODY TYPE */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">Browse by Body Type</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              From family SUVs and executive sedans to smart electric city runabouts
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {BODY_TYPES.map((b) => (
              <Link
                key={b.name}
                to={`/cars?body=${encodeURIComponent(b.name)}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] shadow-sm hover:shadow-card-elevated transition-all"
              >
                <img
                  src={b.image}
                  alt={b.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-extrabold text-sm">{b.name}</h4>
                  <p className="text-[11px] text-[#C6F36B] font-medium">{b.count} cars listed</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. HOW ANTILOG WORKS */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#10151F] bg-slate-100 px-3 py-1 rounded-full">
              Seamless Car Ownership
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230] mt-3">
              How Antilog Works for Car Buyers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent, broker-free used car shopping backed by verified dealership inspections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#10151F] text-[#C6F36B] font-black text-base flex items-center justify-center">
                1
              </div>
              <h3 className="font-extrabold text-base text-[#182230]">Browse or Post Requirement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter verified cars by budget, mileage, fuel type, and transmission across cities. Or describe your dream car and let registered dealerships offer matching stock.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#10151F] text-[#54D7E8] font-black text-base flex items-center justify-center">
                2
              </div>
              <h3 className="font-extrabold text-base text-[#182230]">Inspect & Book Test Drive</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review complete vehicle disclosures including accident history, tyre health, and service records. Schedule a showroom visit or request a doorstep test drive.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#10151F] text-amber-400 font-black text-base flex items-center justify-center">
                3
              </div>
              <h3 className="font-extrabold text-base text-[#182230]">Drive Home with Peace of Mind</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Purchase directly from the verified dealership with guaranteed RC ownership transfer, clear documentation, and dealer-backed warranty support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REQUIREMENT BANNER */}
      <section className="py-16 bg-[#10151F] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-[#54D7E8] uppercase tracking-wider">Can’t find your specific car?</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Let 5+ Verified Dealerships Find It for You
            </h2>
            <p className="text-slate-300 text-sm mt-3 leading-relaxed">
              Post your exact budget, preferred model, and city. Our network of authorized dealers will notify you when a matching vehicle arrives into their showroom inventory.
            </p>
            <div className="pt-6">
              <Link
                to="/requirements"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#54D7E8] text-[#10151F] font-extrabold text-xs hover:bg-[#3ecde0] transition-all shadow-[0_0_20px_rgba(84,215,232,0.3)]"
              >
                <span>Submit Car Requirement</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
