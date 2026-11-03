import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { Heart, Car, ArrowRight } from 'lucide-react';

export const CustomerFavoritesPage: React.FC = () => {
  const [favoriteIds, setFavoriteIds] = useState(() => StorageService.getFavorites());

  useEffect(() => {
    return subscribeToStore(() => {
      setFavoriteIds(StorageService.getFavorites());
    });
  }, []);

  const favoriteVehicles = StorageService.getVehicles().filter((v) =>
    favoriteIds.includes(v.id)
  );

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Saved Vehicles</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                My Shortlisted Vehicles ({favoriteVehicles.length})
              </h1>
              <p className="text-xs text-slate-500">
                Vehicles you have saved for price alerts, comparison, and booking
              </p>
            </div>
          </div>
        </div>

        {favoriteVehicles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">No vehicles saved yet</h3>
            <p className="text-xs text-slate-500">
              Click the heart icon on any vehicle card in the marketplace to add it to your shortlist.
            </p>
            <div className="pt-2">
              <Link
                to="/cars"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#10151F] text-[#C6F36B] text-xs font-bold"
              >
                <span>Browse Available Cars</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteVehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
