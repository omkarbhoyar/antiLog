import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { Vehicle } from '@/types/vehicle';
import { formatPriceINR } from '@/utils/formatters';
import {
  Search,
  Filter,
  Grid,
  List,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Car,
} from 'lucide-react';

export const BrowseCarsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search and view controls
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Filters from URL or default
  const selectedMake = searchParams.get('make') || '';
  const selectedBody = searchParams.get('body') || '';
  const selectedCity = searchParams.get('city') || '';
  const selectedFuel = searchParams.get('fuel') || '';
  const selectedTransmission = searchParams.get('transmission') || '';
  const selectedDealer = searchParams.get('dealer') || '';
  const selectedOwner = searchParams.get('owner') || '';
  const minPrice = Number(searchParams.get('minPrice')) || 0;
  const maxPrice = Number(searchParams.get('maxPrice')) || 10000000;
  const maxKm = Number(searchParams.get('maxKm')) || 100000;

  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);
  const [localMaxKm, setLocalMaxKm] = useState(maxKm);

  // Pagination
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [currentPage, setCurrentPage] = useState(1);

  const allVehicles = StorageService.getVehicles();

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchTerm('');
    setLocalMinPrice(0);
    setLocalMaxPrice(10000000);
    setLocalMaxKm(100000);
    setCurrentPage(1);
  };

  // Filter logic
  const filteredVehicles = useMemo(() => {
    return allVehicles.filter((v) => {
      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchTitle =
          v.make.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.variant.toLowerCase().includes(query) ||
          v.dealerName.toLowerCase().includes(query) ||
          v.dealerCity.toLowerCase().includes(query);
        if (!matchTitle) return false;
      }

      // Make
      if (selectedMake && v.make !== selectedMake) return false;

      // Body
      if (selectedBody && v.specs.bodyType !== selectedBody) return false;

      // City
      if (selectedCity && v.dealerCity !== selectedCity) return false;

      // Fuel
      if (selectedFuel && v.specs.fuelType !== selectedFuel) return false;

      // Transmission
      if (selectedTransmission && v.specs.transmission !== selectedTransmission) return false;

      // Dealer
      if (selectedDealer && v.dealerId !== selectedDealer) return false;

      // Ownership
      if (selectedOwner && v.specs.ownership !== selectedOwner) return false;

      // Price
      if (v.pricing.askingPrice < localMinPrice || v.pricing.askingPrice > localMaxPrice) {
        return false;
      }

      // Km
      if (v.specs.kilometers > localMaxKm) return false;

      return true;
    });
  }, [
    allVehicles,
    searchTerm,
    selectedMake,
    selectedBody,
    selectedCity,
    selectedFuel,
    selectedTransmission,
    selectedDealer,
    selectedOwner,
    localMinPrice,
    localMaxPrice,
    localMaxKm,
  ]);

  // Sorting
  const sortedVehicles = useMemo(() => {
    const list = [...filteredVehicles];
    if (sortBy === 'price_asc') {
      list.sort((a, b) => a.pricing.askingPrice - b.pricing.askingPrice);
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => b.pricing.askingPrice - a.pricing.askingPrice);
    } else if (sortBy === 'year_desc') {
      list.sort((a, b) => b.manufacturingYear - a.manufacturingYear);
    } else if (sortBy === 'km_asc') {
      list.sort((a, b) => a.specs.kilometers - b.specs.kilometers);
    } else {
      // Newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [filteredVehicles, sortBy]);

  // Paginated
  const paginatedVehicles = sortedVehicles.slice(0, currentPage * itemsPerPage);

  const activeFiltersCount = [
    selectedMake,
    selectedBody,
    selectedCity,
    selectedFuel,
    selectedTransmission,
    selectedDealer,
    selectedOwner,
    searchTerm,
    localMaxPrice < 10000000,
    localMaxKm < 100000,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Marketplace</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Available Used Cars</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                Explore Used Cars in India
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {sortedVehicles.length} certified pre-owned vehicles from verified dealerships
              </p>
            </div>

            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-[#10151F] text-white text-xs font-bold self-start"
            >
              <Filter className="w-4 h-4 text-[#C6F36B]" />
              <span>Filters ({activeFiltersCount})</span>
            </button>
          </div>
        </div>

        {/* Top Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search make, model, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Right Controls: Sort & Grid View */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium shrink-0">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="km_asc">Kilometers: Lowest First</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-6">
            <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
            {selectedMake && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                Make: {selectedMake}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => updateParam('make', '')} />
              </span>
            )}
            {selectedBody && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                Body: {selectedBody}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => updateParam('body', '')} />
              </span>
            )}
            {selectedCity && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                City: {selectedCity}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => updateParam('city', '')} />
              </span>
            )}
            {selectedFuel && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                Fuel: {selectedFuel}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => updateParam('fuel', '')} />
              </span>
            )}
            {selectedTransmission && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                Transmission: {selectedTransmission}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => updateParam('transmission', '')} />
              </span>
            )}
            {selectedOwner && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                Owner: {selectedOwner}
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => updateParam('owner', '')} />
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 text-xs text-slate-800 font-medium">
                Search: "{searchTerm}"
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500" onClick={() => setSearchTerm('')} />
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-xs font-bold text-red-600 hover:text-red-700 underline ml-2"
            >
              Reset All
            </button>
          </div>
        )}

        {/* Content Layout: Filter Sidebar + Vehicle Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar (Desktop + Mobile slide) */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? 'block fixed inset-0 z-50 bg-black/50 p-4' : 'hidden'
            }`}
          >
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm max-h-[85vh] lg:max-h-none overflow-y-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm text-slate-900">Refine Search</h3>
                </div>
                <button
                  onClick={clearAllFilters}
                  className="text-[11px] font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Max Budget: {formatPriceINR(localMaxPrice)}
                </label>
                <input
                  type="range"
                  min="500000"
                  max="6000000"
                  step="100000"
                  value={localMaxPrice}
                  onChange={(e) => setLocalMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#10151F]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹5 Lakh</span>
                  <span>₹60+ Lakh</span>
                </div>
              </div>

              {/* Make / Brand */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Brand / Make</label>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {['', 'Hyundai', 'Mahindra', 'Toyota', 'Tata', 'Maruti Suzuki', 'BMW', 'Mercedes-Benz', 'Kia', 'Volkswagen'].map(
                    (make) => (
                      <label
                        key={make || 'all'}
                        className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="makeFilter"
                          checked={selectedMake === make}
                          onChange={() => updateParam('make', make)}
                          className="accent-[#10151F]"
                        />
                        <span>{make || 'All Brands'}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Body Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Body Type</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['', 'SUV', 'Sedan', 'Hatchback', 'MUV', 'Luxury'].map((body) => (
                    <button
                      key={body || 'all'}
                      type="button"
                      onClick={() => updateParam('body', body)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                        selectedBody === body
                          ? 'bg-[#10151F] text-[#C6F36B] border-[#10151F] font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {body || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Fuel Type</label>
                <div className="space-y-1.5">
                  {['', 'Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'].map((fuel) => (
                    <label
                      key={fuel || 'all'}
                      className="flex items-center gap-2 text-xs text-slate-700 hover:text-slate-900 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="fuelFilter"
                        checked={selectedFuel === fuel}
                        onChange={() => updateParam('fuel', fuel)}
                        className="accent-[#10151F]"
                      />
                      <span>{fuel || 'All Fuel Types'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">Transmission</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['', 'Automatic', 'Manual'].map((trans) => (
                    <button
                      key={trans || 'all'}
                      type="button"
                      onClick={() => updateParam('transmission', trans)}
                      className={`py-1.5 px-1 rounded-lg text-xs font-medium border text-center transition-all ${
                        selectedTransmission === trans
                          ? 'bg-[#10151F] text-[#C6F36B] border-[#10151F] font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {trans || 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => updateParam('city', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="">All Cities</option>
                  <option value="Nagpur">Nagpur</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Pune">Pune</option>
                  <option value="New Delhi">New Delhi</option>
                  <option value="Bengaluru">Bengaluru</option>
                </select>
              </div>

              {/* Max Kilometers Driven */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Max Driven: {localMaxKm.toLocaleString('en-IN')} km
                </label>
                <input
                  type="range"
                  min="10000"
                  max="100000"
                  step="5000"
                  value={localMaxKm}
                  onChange={(e) => setLocalMaxKm(Number(e.target.value))}
                  className="w-full accent-[#10151F]"
                />
              </div>

              {/* Mobile Close Button */}
              {mobileFilterOpen && (
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-[#10151F] text-white font-bold text-xs"
                >
                  Apply Filters
                </button>
              )}
            </div>
          </aside>

          {/* Vehicle Grid / Results Column */}
          <main className="lg:col-span-3">
            {paginatedVehicles.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No vehicles match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try broadening your budget, clearing brand restrictions, or submit a custom requirement so dealers can source it for you.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                  >
                    Reset Filters
                  </button>
                  <a
                    href="/requirements"
                    className="px-4 py-2 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231]"
                  >
                    Post Requirement
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {paginatedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {paginatedVehicles.length < sortedVehicles.length && (
                  <div className="text-center pt-6">
                    <button
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="px-8 py-3 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow text-xs font-bold text-slate-800 hover:bg-slate-50 transition-all"
                    >
                      Load More Vehicles ({sortedVehicles.length - paginatedVehicles.length} remaining)
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
