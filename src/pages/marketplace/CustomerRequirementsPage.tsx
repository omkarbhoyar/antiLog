import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { CustomerRequirement } from '@/types/requirement';
import { formatPriceINR } from '@/utils/formatters';
import {
  Sparkles,
  CheckCircle2,
  Car,
  Search,
  ShieldCheck,
  ArrowRight,
  Phone,
  MessageCircle,
} from 'lucide-react';

export const CustomerRequirementsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [brand, setBrand] = useState('Hyundai');
  const [model, setModel] = useState('Creta Automatic');
  const [budgetMin, setBudgetMin] = useState(1000000);
  const [budgetMax, setBudgetMax] = useState(1400000);
  const [fuelType, setFuelType] = useState('Petrol');
  const [transmission, setTransmission] = useState('Automatic');
  const [bodyType, setBodyType] = useState('SUV');
  const [preferredCity, setPreferredCity] = useState(currentUser.city || 'Nagpur');
  const [additionalNotes, setAdditionalNotes] = useState(
    'Looking for a 2021+ model with panoramic sunroof, less than 40k km driven, well maintained.'
  );
  const [customerName, setCustomerName] = useState(currentUser.name || '');
  const [mobileNumber, setMobileNumber] = useState(currentUser.phone || '');
  const [preferredContact, setPreferredContact] = useState<'WhatsApp' | 'Phone Call' | 'Any'>('WhatsApp');
  const [consentShared, setConsentShared] = useState(true);

  const [submittedReq, setSubmittedReq] = useState<CustomerRequirement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !mobileNumber.trim()) {
      alert('Please fill in your name and contact phone number');
      return;
    }

    // Check how many current inventory cars match this requirement
    const matches = StorageService.getVehicles().filter(
      (v) =>
        v.pricing.askingPrice <= budgetMax &&
        (v.make.toLowerCase() === brand.toLowerCase() || v.specs.bodyType === bodyType)
    );

    const newReq: CustomerRequirement = {
      id: 'req-' + Date.now(),
      brand,
      preferredModel: model,
      budgetMin,
      budgetMax,
      fuelType,
      transmission,
      bodyType,
      preferredCity,
      additionalRequirements: additionalNotes,
      customerName,
      mobileNumber,
      preferredContactMethod: preferredContact,
      consentShared,
      status: matches.length > 0 ? 'Matched' : 'Open',
      matchedVehiclesCount: matches.length,
      createdAt: new Date().toISOString(),
    };

    StorageService.saveRequirement(newReq);
    setSubmittedReq(newReq);
    success(
      'Requirement Broadcasted!',
      `Matching verified dealerships in ${preferredCity} have received your requirement.`
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#182231] text-[#54D7E8] text-xs font-semibold mb-3 border border-[#54D7E8]/20">
            <Sparkles className="w-3.5 h-3.5" /> Direct Dealership Auto-Finder
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#182230]">
            Describe Your Ideal Used Car
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Tell us your budget, preferred model, and city. We notify verified dealerships so they can present verified matching vehicles directly to you.
          </p>
        </div>

        {submittedReq ? (
          /* SUCCESS SCREEN */
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-card-elevated text-center space-y-6 animate-fade-in">
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500/20 shadow-glow-lime">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono uppercase bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                Requirement Reference ID: #{submittedReq.id}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                Requirement Successfully Broadcasted!
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900">{submittedReq.customerName}</strong>. Your request for a <strong className="text-slate-900">{submittedReq.brand} {submittedReq.preferredModel}</strong> within {formatPriceINR(submittedReq.budgetMax)} has been dispatched to authorized dealerships in <strong className="text-slate-900">{submittedReq.preferredCity}</strong>.
              </p>
            </div>

            {submittedReq.matchedVehiclesCount && submittedReq.matchedVehiclesCount > 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 max-w-md mx-auto">
                <span className="font-bold text-sm block mb-1">
                  🎉 Good news! We found {submittedReq.matchedVehiclesCount} matching vehicles in stock right now.
                </span>
                <Link
                  to={`/cars?make=${encodeURIComponent(submittedReq.brand)}&maxPrice=${submittedReq.budgetMax}`}
                  className="font-bold underline text-emerald-900 mt-1 inline-block"
                >
                  View Instant Matches in Marketplace →
                </Link>
              </div>
            ) : null}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedReq(null)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
              >
                Post Another Requirement
              </button>
              <Link
                to="/cars"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] transition-colors"
              >
                Browse Current Marketplace
              </Link>
            </div>
          </div>
        ) : (
          /* REQUIREMENT FORM */
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8"
          >
            {/* Step 1: Vehicle Specifications */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-[#182230] flex items-center gap-2 pb-2 border-b border-slate-100">
                <Car className="w-4 h-4 text-blue-600" />
                <span>1. Vehicle Preferences</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Brand</label>
                  <select
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  >
                    <option value="Hyundai">Hyundai</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Tata">Tata</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="Kia">Kia</option>
                    <option value="Honda">Honda</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Audi">Audi</option>
                    <option value="Any Brand">Any Brand</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred Model / Variant</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Creta SX / Thar 4x4 / Fortuner"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                    required
                  />
                </div>
              </div>

              {/* Budget Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Minimum Budget: {formatPriceINR(budgetMin)}
                  </label>
                  <input
                    type="range"
                    min="300000"
                    max="5000000"
                    step="50000"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(Number(e.target.value))}
                    className="w-full accent-[#10151F]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Maximum Budget: {formatPriceINR(budgetMax)}
                  </label>
                  <input
                    type="range"
                    min="500000"
                    max="6000000"
                    step="50000"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(Number(e.target.value))}
                    className="w-full accent-[#10151F]"
                  />
                </div>
              </div>

              {/* Fuel & Transmission */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Any">Any Fuel</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Any">Any</option>
                    <option value="Automatic">Automatic Only</option>
                    <option value="Manual">Manual Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Preferred City</label>
                  <select
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                  >
                    <option value="Nagpur">Nagpur</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Pune">Pune</option>
                    <option value="New Delhi">New Delhi</option>
                    <option value="Bengaluru">Bengaluru</option>
                  </select>
                </div>
              </div>

              {/* Additional notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Additional Requirements / Specific Preferences
                </label>
                <textarea
                  rows={3}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="e.g. White or Black color preferred, single owner, under 30k km, no accidental history."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                ></textarea>
              </div>
            </div>

            {/* Step 2: Contact Information */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-base text-[#182230] flex items-center gap-2 pb-2 border-b border-slate-100">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>2. Contact Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ashish Deshmukh"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Preferred Mode of Contact
                </label>
                <div className="flex items-center gap-3">
                  {['WhatsApp', 'Phone Call', 'Any'].map((m) => (
                    <label
                      key={m}
                      className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="contactPref"
                        checked={preferredContact === m}
                        onChange={() => setPreferredContact(m as any)}
                        className="accent-[#10151F]"
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consent Toggle */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCheckbox"
                  checked={consentShared}
                  onChange={(e) => setConsentShared(e.target.checked)}
                  className="mt-0.5 accent-[#10151F] shrink-0"
                  required
                />
                <label htmlFor="consentCheckbox" className="text-xs text-slate-600 leading-relaxed">
                  I agree to share my vehicle requirement with authorized Antilog registered used-car dealerships so they may contact me with matching inventory. No spam guarantee.
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-[#10151F] text-white hover:bg-[#182231] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-[#C6F36B] group-hover:rotate-12 transition-transform" />
                <span>Submit Vehicle Requirement</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
