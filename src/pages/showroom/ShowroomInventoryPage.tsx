import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { ShowroomNavbar } from '@/components/showroom/ShowroomNavbar';
import { ShowroomFooter } from '@/components/showroom/ShowroomFooter';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { Search, Filter, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const ShowroomInventoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dealer = StorageService.getDealerBySlug(slug || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedBody, setSelectedBody] = useState('');
  const [selectedFuel, setSelectedFuel] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  if (!dealer) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Showroom Not Found</h2>
          <Link
            to="/dealers"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-[#10151F] text-[#C6F36B] text-xs font-bold"
          >
            All Showrooms
          </Link>
        </div>
      </div>
    );
  }

  // Vehicles belonging to this dealer
  const dealerVehicles = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);

  const filtered = useMemo(() => {
    return dealerVehicles.filter((v) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matches =
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.variant.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (selectedMake && v.make !== selectedMake) return false;
      if (selectedBody && v.specs.bodyType !== selectedBody) return false;
      if (selectedFuel && v.specs.fuelType !== selectedFuel) return false;
      return true;
    });
  }, [dealerVehicles, searchTerm, selectedMake, selectedBody, selectedFuel]);

  const sorted = useMemo(() => {
    const list = [...filtered];
    if (sortBy === 'price_asc') list.sort((a, b) => a.pricing.askingPrice - b.pricing.askingPrice);
    else if (sortBy === 'price_desc') list.sort((a, b) => b.pricing.askingPrice - a.pricing.askingPrice);
    else if (sortBy === 'year_desc') list.sort((a, b) => b.manufacturingYear - a.manufacturingYear);
    else if (sortBy === 'km_asc') list.sort((a, b) => a.specs.kilometers - b.specs.kilometers);
    return list;
  }, [filtered, sortBy]);

  const uniqueMakes = Array.from(new Set(dealerVehicles.map((v) => v.make)));

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
      <div>
        <ShowroomNavbar dealer={dealer} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
              <Link to={`/showroom/${dealer.slug}`} className="hover:text-slate-800">
                {dealer.name}
              </Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Current Inventory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
              Vehicles in Stock at {dealer.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing {sorted.length} verified cars available for immediate inspection and test drive
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              {/* Make Filter */}
              <select
                value={selectedMake}
                onChange={(e) => setSelectedMake(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="">All Makes</option>
                {uniqueMakes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              {/* Body Type */}
              <select
                value={selectedBody}
                onChange={(e) => setSelectedBody(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="">All Body Types</option>
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="MUV">MUV</option>
                <option value="Luxury">Luxury</option>
              </select>

              {/* Fuel */}
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
              >
                <option value="newest">Recently Listed</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Year: Newest First</option>
                <option value="km_asc">Kilometers: Lowest</option>
              </select>

              {(searchTerm || selectedMake || selectedBody || selectedFuel) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedMake('');
                    setSelectedBody('');
                    setSelectedFuel('');
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cars Grid */}
          {sorted.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <h3 className="font-bold text-base text-slate-800">No vehicles match filters</h3>
              <p className="text-xs text-slate-500">Try clearing filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sorted.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>

      <ShowroomFooter dealer={dealer} />
    </div>
  );
};
