import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatPriceINR } from '@/utils/formatters';
import {
  Sliders,
  Flame,
  Star,
  CheckCircle2,
  Car,
  Building2,
  Tag,
  Save,
} from 'lucide-react';

export const AdminMarketplacePage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { success } = useToast();

  const [vehicles, setVehicles] = useState(() => StorageService.getVehicles());
  const dealers = StorageService.getDealers();

  const handleToggleFeatured = (vehicleId: string) => {
    const list = StorageService.getVehicles();
    const target = list.find((v) => v.id === vehicleId);
    if (target) {
      target.isFeatured = !target.isFeatured;
      StorageService.saveVehicle(target);
      setVehicles(StorageService.getVehicles());
      success(
        target.isFeatured ? 'Pinned to Featured' : 'Removed from Featured',
        `${target.make} ${target.model} updated on homepage.`
      );
    }
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Marketplace Curation & Editorial Controls"
        subtitle="Curate hero spotlights, pin featured dealership inventory, and manage discovery taxonomies"
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Featured Vehicles Curator */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Flame className="w-4 h-4 text-emerald-600" />
                <span>Featured Homepage Vehicles ({vehicles.filter((v) => v.isFeatured).length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Vehicles pinned here appear at the top of the antilog.com customer marketplace
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  v.isFeatured
                    ? 'border-[#10151F] bg-slate-50/70 shadow-sm'
                    : 'border-slate-200 bg-white opacity-80'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={v.primaryImage}
                    alt={v.model}
                    className="w-14 h-10 object-cover rounded-lg shrink-0"
                  />
                  <div className="overflow-hidden">
                    <h5 className="font-bold text-xs text-slate-900 truncate">
                      {v.make} {v.model}
                    </h5>
                    <p className="text-[10px] text-slate-500 truncate">{v.dealerName}</p>
                    <p className="text-[11px] font-bold text-[#10151F]">
                      {formatPriceINR(v.pricing.askingPrice)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFeatured(v.id)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border transition-all shrink-0 ${
                    v.isFeatured
                      ? 'bg-[#10151F] text-[#C6F36B] border-[#10151F]'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {v.isFeatured ? '★ Featured' : '+ Feature'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Dealerships Curation */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Showroom Spotlight Pins</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {dealers.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900">{d.name}</h4>
                  <p className="text-slate-500 text-[11px]">{d.contact.city} • {d.activeListingsCount} cars</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active Partner
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
