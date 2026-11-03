import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { Vehicle } from '@/types/vehicle';
import { formatPriceINR, formatKilometers } from '@/utils/formatters';
import {
  QrCode,
  Printer,
  Copy,
  Download,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Car,
  Fuel,
  Gauge,
  Sparkles,
} from 'lucide-react';

export const DealerQRCodesPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const vehicles = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle>(vehicles[0] || null);

  const vehiclePublicUrl = selectedVehicle
    ? `${window.location.origin}/showroom/${dealer.slug}/cars/${selectedVehicle.id}`
    : '';

  // Generate SVG QR code representation using encoded URL
  const qrSvgUrl = selectedVehicle
    ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        vehiclePublicUrl
      )}&color=10-15-31`
    : '';

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(vehiclePublicUrl);
    success('Vehicle Link Copied', 'Paste into WhatsApp or marketing channels.');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Vehicle Window QR Code Generator"
        subtitle="Generate printable window stickers for your showroom lot vehicles"
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Vehicle Picker & Scan Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Select Vehicle to Generate QR</span>
              </h3>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {vehicles.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVehicle(v)}
                    className={`w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      selectedVehicle?.id === v.id
                        ? 'border-[#10151F] bg-[#10151F] text-white shadow-md'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-bold text-xs truncate">
                        {v.manufacturingYear} {v.make} {v.model}
                      </p>
                      <p className={`text-[11px] truncate ${selectedVehicle?.id === v.id ? 'text-slate-300' : 'text-slate-500'}`}>
                        {formatPriceINR(v.pricing.askingPrice)} • {v.specs.fuelType}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                        selectedVehicle?.id === v.id ? 'bg-[#C6F36B] text-[#10151F]' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {v.qrScansCount} scans
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            {selectedVehicle && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-bold text-xs text-slate-800">Direct Actions</h4>
                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-[#C6F36B]" />
                  <span>Print Window Sticker Card</span>
                </button>

                <button
                  onClick={handleCopyUrl}
                  className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Showroom URL</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: High Quality Printable Window Sticker Card */}
          <div className="lg:col-span-2">
            {selectedVehicle && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">
                    Printable Lot Window Display Card (A4 format)
                  </span>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Now</span>
                  </button>
                </div>

                {/* PRINTABLE CARD CONTAINER */}
                <div
                  id="printable-vehicle-card"
                  className="bg-white rounded-3xl border-2 border-slate-300 p-8 shadow-card-elevated space-y-6"
                >
                  {/* Dealership Header */}
                  <div className="flex items-center justify-between pb-6 border-b-2 border-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#10151F] text-[#C6F36B] flex items-center justify-center font-extrabold text-xl">
                        {dealer.name[0]}
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          {dealer.name}
                        </h2>
                        <p className="text-xs text-slate-600 font-medium">
                          {dealer.contact.address}, {dealer.contact.city}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 bg-[#10151F] text-[#C6F36B] font-extrabold text-xs px-3 py-1 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5" /> 150-Point Inspected
                      </span>
                      <p className="text-[11px] text-slate-500 mt-1 font-mono">
                        {dealer.customDomain}
                      </p>
                    </div>
                  </div>

                  {/* Vehicle Headline & Price */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {selectedVehicle.manufacturingYear} Model • {selectedVehicle.specs.ownership}
                      </span>
                      <h1 className="text-3xl font-black text-slate-900 leading-tight">
                        {selectedVehicle.make} {selectedVehicle.model}
                      </h1>
                      <p className="text-sm font-semibold text-slate-600">
                        {selectedVehicle.variant}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-3xl font-black text-[#10151F]">
                        {formatPriceINR(selectedVehicle.pricing.askingPrice)}
                      </span>
                      {selectedVehicle.pricing.negotiable && (
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">Price Negotiable</p>
                      )}
                    </div>
                  </div>

                  {/* QR Code and Specs Grid */}
                  <div className="grid grid-cols-3 gap-6 items-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                    {/* QR Code */}
                    <div className="text-center space-y-2">
                      <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 inline-block">
                        <img
                          src={qrSvgUrl}
                          alt="QR Code"
                          className="w-36 h-36 mx-auto object-contain"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                        Scan to View Complete History & Inspection Report
                      </p>
                    </div>

                    {/* Specifications List */}
                    <div className="col-span-2 space-y-3 text-xs">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Odometer</span>
                          <span className="text-sm font-bold text-slate-800">
                            {formatKilometers(selectedVehicle.specs.kilometers)}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Fuel & Transmission</span>
                          <span className="text-sm font-bold text-slate-800">
                            {selectedVehicle.specs.fuelType} • {selectedVehicle.specs.transmission}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">RTO Registration</span>
                          <span className="text-sm font-bold text-slate-800">
                            {selectedVehicle.specs.rtoLocation}
                          </span>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="text-[10px] text-slate-400 block font-semibold">Condition Grade</span>
                          <span className="text-sm font-bold text-emerald-600">
                            Grade {selectedVehicle.condition.grade} (Non-Accidental)
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                        <p>✓ Complete service records verified</p>
                        <p>✓ Guaranteed RC ownership title transfer</p>
                        <p>✓ Fast car finance approval assistance available on site</p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Hotline */}
                  <div className="pt-4 border-t-2 border-slate-900 flex items-center justify-between text-xs text-slate-700 font-bold">
                    <span>Showroom Hotline: {dealer.contact.phone}</span>
                    <span>Antilog Digital Dealership Certified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
