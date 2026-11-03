import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { VehicleCard } from '@/components/marketplace/VehicleCard';
import { BookTestDriveModal } from '@/components/marketplace/BookTestDriveModal';
import { EnquiryModal } from '@/components/marketplace/EnquiryModal';
import { formatPriceINR, formatKilometers, formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';
import {
  Heart,
  Share2,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  User,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Phone,
  MessageCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Printer,
  Play,
  ArrowRight,
  Award,
  Eye,
  Info,
} from 'lucide-react';

export const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { success, info } = useToast();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isTestDriveOpen, setIsTestDriveOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const vehicle = StorageService.getVehicleById(id || '');
  const [isFav, setIsFav] = useState(() => (vehicle ? StorageService.isFavorite(vehicle.id) : false));

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border border-slate-200 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Vehicle Not Found</h2>
          <p className="text-xs text-slate-500">
            The vehicle listing you are looking for may have been sold or removed.
          </p>
          <Link
            to="/cars"
            className="inline-block px-5 py-2.5 rounded-xl bg-[#10151F] text-[#C6F36B] text-xs font-bold"
          >
            Browse Other Cars
          </Link>
        </div>
      </div>
    );
  }

  const dealer = StorageService.getDealerById(vehicle.dealerId);
  const similarVehicles = StorageService.getVehicles()
    .filter((v) => v.id !== vehicle.id && (v.specs.bodyType === vehicle.specs.bodyType || v.make === vehicle.make))
    .slice(0, 3);

  const handleToggleFavorite = () => {
    const added = StorageService.toggleFavorite(vehicle.id);
    setIsFav(added);
    if (added) {
      success('Vehicle Shortlisted', 'Saved to your favorite vehicles collection.');
    } else {
      info('Vehicle Removed', 'Removed from favorites.');
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Link Copied!', 'Vehicle listing URL copied to clipboard.');
  };

  const handleCallDealer = () => {
    window.location.href = `tel:${vehicle.dealerPhone}`;
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent(
      `Hello ${vehicle.dealerName}, I am viewing your ${vehicle.make} ${vehicle.model} (${vehicle.variant}) listed for ${formatPriceINR(vehicle.pricing.askingPrice)} on Antilog. I would like more information.`
    );
    window.open(`https://wa.me/${vehicle.dealerWhatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8">
      {/* Test drive and Enquiry interactive modals */}
      <BookTestDriveModal
        vehicle={vehicle}
        isOpen={isTestDriveOpen}
        onClose={() => setIsTestDriveOpen(false)}
      />
      <EnquiryModal
        vehicle={vehicle}
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-5 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Link to="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <Link to="/cars" className="hover:text-slate-800">Used Cars</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold truncate max-w-xs sm:max-w-md">
              {vehicle.make} {vehicle.model}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                isFav
                  ? 'bg-red-50 text-red-600 border-red-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500' : ''}`} />
              <span>{isFav ? 'Shortlisted' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {vehicle.manufacturingYear} • {vehicle.specs.ownership}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#10151F] text-[#C6F36B] font-bold text-[10px]">
                Grade {vehicle.condition.grade}
              </span>
              {vehicle.status !== 'available' && (
                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                  {vehicle.status}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
              {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{vehicle.variant}</p>
          </div>

          <div className="flex flex-col md:items-end justify-center">
            <span className="text-3xl font-black text-[#10151F]">
              {formatPriceINR(vehicle.pricing.askingPrice)}
            </span>
            {vehicle.pricing.negotiable ? (
              <span className="text-xs font-semibold text-emerald-600 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Price Negotiable on table
              </span>
            ) : (
              <span className="text-xs font-semibold text-slate-400 mt-0.5">Fixed Price</span>
            )}
          </div>
        </div>

        {/* Main Grid: Gallery & Specs Column (Left) vs Dealer CTA Card (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. IMAGE GALLERY */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Primary Active Image Display */}
              <div className="relative aspect-[16/10] bg-slate-900 group">
                <img
                  src={vehicle.images[activeImageIndex] || vehicle.primaryImage}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                />

                {/* Left/Right image switcher arrows if multiple images */}
                {vehicle.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : vehicle.images.length - 1))
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActiveImageIndex((prev) => (prev < vehicle.images.length - 1 ? prev + 1 : 0))
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium">
                  Photo {activeImageIndex + 1} of {vehicle.images.length}
                </div>
              </div>

              {/* Thumbnails row */}
              {vehicle.images.length > 1 && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-3 overflow-x-auto">
                  {vehicle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx ? 'border-[#10151F] ring-2 ring-[#C6F36B]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. KEY SPECIFICATIONS GRID */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-[#182230] flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#54D7E8]" />
                <span>Vehicle Specifications</span>
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Kilometers Driven</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {formatKilometers(vehicle.specs.kilometers)}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Fuel Type</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {vehicle.specs.fuelType}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Transmission</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {vehicle.specs.transmission}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Ownership History</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {vehicle.specs.ownership}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">RTO Registration</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
                    {vehicle.specs.rtoLocation}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Exterior Color</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {vehicle.specs.color}
                  </span>
                </div>

                {vehicle.specs.engineCapacity && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Engine Displacement</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {vehicle.specs.engineCapacity}
                    </span>
                  </div>
                )}

                {vehicle.specs.mileage && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 block text-[11px]">Fuel Efficiency / Range</span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {vehicle.specs.mileage}
                    </span>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Seating Capacity</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {vehicle.specs.seatingCapacity} Persons
                  </span>
                </div>
              </div>
            </div>

            {/* 3. CONDITION & DISCLOSURE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-[#182230] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Condition & History Disclosure</span>
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {vehicle.condition.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Accident History Disclosure</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {vehicle.condition.accidentDisclosure}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Authorized Service History</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {vehicle.condition.serviceHistory}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <ShieldCheck className="w-5 h-5 text-[#C6F36B] shrink-0 mt-0.5 bg-[#10151F] rounded p-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Insurance Status</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {vehicle.condition.insuranceStatus} {vehicle.condition.insuranceValidity && `(Valid till ${formatDate(vehicle.condition.insuranceValidity)})`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <Gauge className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-slate-900">Tyre Health Condition</h5>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      {vehicle.condition.tyreConditionPercent}% Remaining Tread Life
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. 150-POINT INSPECTION REPORT BREAKDOWN */}
            {vehicle.inspection && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-[#182230] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#C6F36B] bg-[#10151F] rounded p-0.5" />
                    <span>Inspection Report Certification</span>
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Inspected on {formatDate(vehicle.inspection.inspectionDate || '2026-09-15')}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs font-extrabold text-emerald-600 text-lg">
                      {vehicle.inspection.engineTransmissionScore}/10
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Engine & Gearbox</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs font-extrabold text-emerald-600 text-lg">
                      {vehicle.inspection.exteriorBodyScore}/10
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Body & Paint</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs font-extrabold text-emerald-600 text-lg">
                      {vehicle.inspection.interiorElectronicsScore}/10
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Interior & Cabin</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-xs font-extrabold text-emerald-600 text-lg">
                      {vehicle.inspection.steeringSuspensionScore}/10
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">Suspension & Steering</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500 border-t border-slate-100">
                  <span>Certified Inspector: <strong>{vehicle.inspection.inspectorName}</strong></span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No Tampering Detected
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dealer Info & Quick Booking CTA Card */}
          <div className="space-y-6">
            {/* Dealer Box */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 sticky top-28">
              <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-[#182231] flex items-center justify-center text-base font-extrabold text-[#C6F36B] shrink-0 border border-[#C6F36B]/30">
                  {vehicle.dealerName[0]}
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-[#182230] leading-tight">
                    {vehicle.dealerName}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    {vehicle.dealerVerified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified Showroom
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vehicle.dealerCity}</span>
                  </p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 py-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Asking Vehicle Price</span>
                  <span className="font-bold text-slate-900">{formatPriceINR(vehicle.pricing.askingPrice)}</span>
                </div>
                {vehicle.pricing.additionalCharges?.rtoTransfer && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">RTO Name Transfer Fee</span>
                    <span className="font-medium text-slate-700">₹{vehicle.pricing.additionalCharges.rtoTransfer}</span>
                  </div>
                )}
                {vehicle.pricing.additionalCharges?.processingFee && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Documentation & Handling</span>
                    <span className="font-medium text-slate-700">₹{vehicle.pricing.additionalCharges.processingFee}</span>
                  </div>
                )}
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setIsTestDriveOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-[#C6F36B] group-hover:rotate-12 transition-transform" />
                  <span>Schedule Test Drive</span>
                </button>

                <button
                  onClick={handleWhatsapp}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleCallDealer}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>Call Dealer</span>
                  </button>

                  <button
                    onClick={() => setIsEnquiryOpen(true)}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-slate-600" />
                    <span>Callback</span>
                  </button>
                </div>

                <Link
                  to={`/showroom/${vehicle.dealerSlug}`}
                  className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline pt-2"
                >
                  Visit {vehicle.dealerName}’s Digital Showroom →
                </Link>
              </div>

              {/* Trust Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#C6F36B] bg-[#10151F] rounded p-0.5" />
                  <span>Antilog Buyer Protection</span>
                </div>
                <p>• Verified ownership documentation & clear RC record</p>
                <p>• Zero customer commission or hidden broker charges</p>
                <p>• Doorstep test drive available upon dealer confirmation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles Section */}
        {similarVehicles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <h3 className="text-xl font-extrabold text-[#182230] mb-6">
              Similar Vehicles You May Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((sim) => (
                <VehicleCard key={sim.id} vehicle={sim} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
