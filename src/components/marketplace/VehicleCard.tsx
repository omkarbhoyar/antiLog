import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vehicle } from '@/types/vehicle';
import { formatPriceINR, formatKilometers } from '@/utils/formatters';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import {
  Heart,
  ShieldCheck,
  Fuel,
  Gauge,
  Calendar,
  MapPin,
  ExternalLink,
  MessageCircle,
  Eye,
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  viewMode?: 'grid' | 'list';
  onQuickEnquiry?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  viewMode = 'grid',
  onQuickEnquiry,
}) => {
  const [isFav, setIsFav] = useState(() => StorageService.isFavorite(vehicle.id));
  const { success, info } = useToast();

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = StorageService.toggleFavorite(vehicle.id);
    setIsFav(added);
    if (added) {
      success('Saved to Favorites', `${vehicle.make} ${vehicle.model} added to your shortlist.`);
    } else {
      info('Removed from Favorites', `${vehicle.make} ${vehicle.model} removed from shortlist.`);
    }
  };

  const handleWhatsapp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(
      `Hello ${vehicle.dealerName}, I am interested in your ${vehicle.make} ${vehicle.model} (${vehicle.variant}) listed on Antilog for ${formatPriceINR(vehicle.pricing.askingPrice)}.`
    );
    window.open(`https://wa.me/${vehicle.dealerWhatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-card-elevated transition-all overflow-hidden flex flex-col md:flex-row group">
        {/* Image Box */}
        <div className="relative md:w-72 lg:w-80 h-52 md:h-auto shrink-0 overflow-hidden bg-slate-900">
          <img
            src={vehicle.primaryImage}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {vehicle.isFeatured && (
              <span className="bg-[#C6F36B] text-[#10151F] font-bold text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-md shadow-sm">
                Featured
              </span>
            )}
            <span className="bg-[#10151F]/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
              Grade {vehicle.condition.grade}
            </span>
          </div>

          {/* Fav Heart */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 hover:bg-black/60 transition-all"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>

          {/* Status Badge */}
          {vehicle.status !== 'available' && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md ${
                  vehicle.status === 'sold'
                    ? 'bg-red-500 text-white'
                    : vehicle.status === 'reserved'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {vehicle.status}
              </span>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {vehicle.manufacturingYear} • {vehicle.specs.ownership}
                </span>
                <h3 className="text-lg font-bold text-[#182230] group-hover:text-blue-600 transition-colors">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-xs text-slate-500 -mt-0.5 line-clamp-1">{vehicle.variant}</p>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-[#10151F]">
                  {formatPriceINR(vehicle.pricing.askingPrice)}
                </span>
                {vehicle.pricing.negotiable && (
                  <p className="text-[10px] font-semibold text-emerald-600">Price Negotiable</p>
                )}
              </div>
            </div>

            {/* Spec Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{formatKilometers(vehicle.specs.kilometers)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{vehicle.specs.fuelType}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{vehicle.specs.transmission}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{vehicle.dealerCity}</span>
              </div>
            </div>
          </div>

          {/* Bottom Dealer & Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-wrap">
            <Link
              to={`/dealers/${vehicle.dealerSlug}`}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-6 h-6 rounded-md bg-[#182231] flex items-center justify-center text-[10px] font-bold text-[#C6F36B]">
                {vehicle.dealerName[0]}
              </div>
              <span className="text-xs font-semibold text-slate-700">{vehicle.dealerName}</span>
              {vehicle.dealerVerified && (
                <span title="Verified Antilog Dealer">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsapp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <Link
                to={`/cars/${vehicle.id}`}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shadow-sm"
              >
                <span>View Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Default)
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-card-elevated transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={vehicle.primaryImage}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {vehicle.isFeatured && (
            <span className="bg-[#C6F36B] text-[#10151F] font-extrabold text-[10px] tracking-wide uppercase px-2.5 py-0.5 rounded-md shadow-sm">
              Featured
            </span>
          )}
          <span className="bg-[#10151F]/80 backdrop-blur-md text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
            Grade {vehicle.condition.grade}
          </span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-red-400 hover:bg-black/60 transition-all z-10"
          title="Save vehicle"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Status Overlay if Sold or Reserved */}
        {vehicle.status !== 'available' && (
          <div className="absolute bottom-3 left-3">
            <span
              className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md shadow ${
                vehicle.status === 'sold'
                  ? 'bg-red-600 text-white'
                  : vehicle.status === 'reserved'
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {vehicle.status}
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Title & Price */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                {vehicle.manufacturingYear} • {vehicle.specs.ownership}
              </span>
              <h3 className="font-bold text-base text-[#182230] group-hover:text-blue-600 transition-colors leading-snug">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{vehicle.variant}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-extrabold text-[#10151F]">
                {formatPriceINR(vehicle.pricing.askingPrice)}
              </span>
              {vehicle.pricing.negotiable && (
                <p className="text-[10px] font-semibold text-emerald-600">Negotiable</p>
              )}
            </div>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-1.5 my-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Gauge className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{formatKilometers(vehicle.specs.kilometers)}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Fuel className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.specs.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{vehicle.specs.transmission}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate">{vehicle.dealerCity}</span>
            </div>
          </div>
        </div>

        {/* Dealer Footer & View Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
          <Link
            to={`/dealers/${vehicle.dealerSlug}`}
            className="flex items-center gap-1.5 overflow-hidden hover:opacity-80 transition-opacity"
          >
            <div className="w-5 h-5 rounded-md bg-[#182231] flex items-center justify-center text-[9px] font-bold text-[#C6F36B] shrink-0">
              {vehicle.dealerName[0]}
            </div>
            <span className="text-xs font-medium text-slate-700 truncate">{vehicle.dealerName}</span>
            {vehicle.dealerVerified && (
              <span title="Verified Dealer" className="shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              </span>
            )}
          </Link>

          <Link
            to={`/cars/${vehicle.id}`}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shrink-0"
          >
            <span>Details</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};
