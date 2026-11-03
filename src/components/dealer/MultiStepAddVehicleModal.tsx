import React, { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceINR, slugify } from '@/utils/formatters';
import {
  X,
  CheckCircle2,
  Car,
  Settings,
  DollarSign,
  ShieldCheck,
  Image as ImageIcon,
  Send,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Upload,
  Plus,
  Trash2,
  Eye,
  Lock,
} from 'lucide-react';

interface MultiStepAddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleSaved?: (vehicle: Vehicle) => void;
  editVehicle?: Vehicle | null;
}

export const MultiStepAddVehicleModal: React.FC<MultiStepAddVehicleModalProps> = ({
  isOpen,
  onClose,
  onVehicleSaved,
  editVehicle,
}) => {
  const { currentUser } = useAuth();
  const { success } = useToast();
  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [currentStep, setCurrentStep] = useState(1);

  // STEP 1: Basic details
  const [make, setMake] = useState(editVehicle?.make || 'Hyundai');
  const [model, setModel] = useState(editVehicle?.model || 'Creta');
  const [variant, setVariant] = useState(editVehicle?.variant || 'SX (O) 1.5 Turbo DCT');
  const [manufacturingYear, setManufacturingYear] = useState(editVehicle?.manufacturingYear || 2023);
  const [registrationYear, setRegistrationYear] = useState(editVehicle?.registrationYear || 2023);
  const [registrationCity, setRegistrationCity] = useState(
    editVehicle?.registrationCity || `${dealer.contact.city} (MH-31)`
  );

  // STEP 2: Technical specifications
  const [fuelType, setFuelType] = useState<any>(editVehicle?.specs.fuelType || 'Petrol');
  const [transmission, setTransmission] = useState<any>(editVehicle?.specs.transmission || 'Automatic');
  const [kilometers, setKilometers] = useState(editVehicle?.specs.kilometers || 24000);
  const [ownership, setOwnership] = useState<any>(editVehicle?.specs.ownership || '1st Owner');
  const [bodyType, setBodyType] = useState<any>(editVehicle?.specs.bodyType || 'SUV');
  const [engineCapacity, setEngineCapacity] = useState(editVehicle?.specs.engineCapacity || '1497 cc');
  const [color, setColor] = useState(editVehicle?.specs.color || 'Phantom Black');
  const [seatingCapacity, setSeatingCapacity] = useState(editVehicle?.specs.seatingCapacity || 5);

  // STEP 3: Pricing
  const [askingPrice, setAskingPrice] = useState(editVehicle?.pricing.askingPrice || 1450000);
  const [negotiable, setNegotiable] = useState(editVehicle?.pricing.negotiable ?? true);
  const [acquisitionPrice, setAcquisitionPrice] = useState(editVehicle?.pricing.acquisitionPrice || 1310000);
  const [rtoTransferFee, setRtoTransferFee] = useState(editVehicle?.pricing.additionalCharges?.rtoTransfer || 3500);

  // STEP 4: Vehicle Condition & Disclosure
  const [grade, setGrade] = useState<any>(editVehicle?.condition.grade || 'A+');
  const [description, setDescription] = useState(
    editVehicle?.condition.description ||
      'Single owner, immaculate showroom condition, full authorised dealer service records. Panoramic sunroof, ventilated seats.'
  );
  const [accidentDisclosure, setAccidentDisclosure] = useState<any>(
    editVehicle?.condition.accidentDisclosure || 'Clean Record (No Accidents)'
  );
  const [repairDisclosure, setRepairDisclosure] = useState(
    editVehicle?.condition.repairDisclosure || 'Original factory paint. Zero structural or body repairs.'
  );
  const [insuranceStatus, setInsuranceStatus] = useState<any>(
    editVehicle?.condition.insuranceStatus || 'Comprehensive'
  );
  const [serviceHistory, setServiceHistory] = useState<any>(
    editVehicle?.condition.serviceHistory || 'Full Authorized Service Records'
  );
  const [tyreConditionPercent, setTyreConditionPercent] = useState(
    editVehicle?.condition.tyreConditionPercent || 88
  );

  // STEP 5: Media & Inspection
  const [primaryImage, setPrimaryImage] = useState(
    editVehicle?.primaryImage ||
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80'
  );
  const [galleryImages, setGalleryImages] = useState<string[]>(
    editVehicle?.images || [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    ]
  );
  const [newImageUrl, setNewImageUrl] = useState('');
  const [engineScore, setEngineScore] = useState(editVehicle?.inspection?.engineTransmissionScore || 9.8);
  const [bodyScore, setBodyScore] = useState(editVehicle?.inspection?.exteriorBodyScore || 9.6);
  const [interiorScore, setInteriorScore] = useState(editVehicle?.inspection?.interiorElectronicsScore || 9.7);
  const [suspensionScore, setSuspensionScore] = useState(editVehicle?.inspection?.steeringSuspensionScore || 9.6);

  if (!isOpen) return null;

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setGalleryImages([...galleryImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
  };

  const handlePublish = (status: 'available' | 'inactive') => {
    const vehicleId = editVehicle?.id || 'veh-' + Date.now();
    const slug = slugify(`${make}-${model}-${variant}-${manufacturingYear}`);

    const newVehicle: Vehicle = {
      id: vehicleId,
      slug,
      dealerId: dealer.id,
      dealerName: dealer.name,
      dealerSlug: dealer.slug,
      dealerCity: dealer.contact.city,
      dealerVerified: dealer.verified,
      dealerPhone: dealer.contact.phone,
      dealerWhatsapp: dealer.contact.whatsapp,
      make,
      model,
      variant,
      manufacturingYear,
      registrationYear,
      registrationCity,
      specs: {
        fuelType,
        transmission,
        kilometers,
        ownership,
        bodyType,
        engineCapacity,
        color,
        seatingCapacity,
        rtoLocation: registrationCity,
      },
      pricing: {
        askingPrice,
        negotiable,
        acquisitionPrice,
        additionalCharges: { rtoTransfer: rtoTransferFee },
      },
      condition: {
        grade,
        description,
        accidentDisclosure,
        repairDisclosure,
        insuranceStatus,
        serviceHistory,
        tyreConditionPercent,
        batteryCondition: 'Excellent',
      },
      inspection: {
        engineTransmissionScore: engineScore,
        exteriorBodyScore: bodyScore,
        interiorElectronicsScore: interiorScore,
        steeringSuspensionScore: suspensionScore,
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectorName: 'Anil Verma (Senior Certifier)',
      },
      images: galleryImages,
      primaryImage: primaryImage || galleryImages[0],
      status,
      moderationStatus: 'approved',
      isFeatured: true,
      viewsCount: editVehicle?.viewsCount || 0,
      enquiriesCount: editVehicle?.enquiriesCount || 0,
      qrScansCount: editVehicle?.qrScansCount || 0,
      createdAt: editVehicle?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveVehicle(newVehicle);
    if (onVehicleSaved) onVehicleSaved(newVehicle);
    success(
      status === 'available' ? 'Vehicle Published!' : 'Saved as Draft Listing',
      `${make} ${model} (${variant}) is now active in ${dealer.name} inventory.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header & Stepper Bar */}
        <div className="bg-[#10151F] text-white p-6 border-b border-[#233044]">
          <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#182231] border border-[#C6F36B]/40 flex items-center justify-center text-[#C6F36B]">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {editVehicle ? 'Edit Vehicle Listing' : 'Add New Inventory Vehicle'}
                </h3>
                <p className="text-xs text-slate-400">Step {currentStep} of 6 — Multi-Step Listing Flow</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-6 gap-2 pt-2 text-[10px] font-semibold text-center">
            {[
              { num: 1, label: 'Basic' },
              { num: 2, label: 'Technical' },
              { num: 3, label: 'Pricing' },
              { num: 4, label: 'Condition' },
              { num: 5, label: 'Media' },
              { num: 6, label: 'Publish' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`py-1.5 rounded-lg border transition-all ${
                  currentStep === s.num
                    ? 'bg-[#C6F36B] text-[#10151F] font-bold border-[#C6F36B]'
                    : currentStep > s.num
                    ? 'bg-[#182231] text-[#C6F36B] border-[#233044]'
                    : 'bg-[#182231]/50 text-slate-500 border-transparent'
                }`}
              >
                <span>{s.num}. {s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* STEP 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-600" />
                <span>Vehicle Identification</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturer / Make</label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Hyundai">Hyundai</option>
                    <option value="Mahindra">Mahindra</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Tata">Tata</option>
                    <option value="Maruti Suzuki">Maruti Suzuki</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes-Benz">Mercedes-Benz</option>
                    <option value="Kia">Kia</option>
                    <option value="Volkswagen">Volkswagen</option>
                    <option value="Honda">Honda</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Model Name</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Creta, Thar, Seltos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Variant & Trim</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  placeholder="e.g. SX (O) 1.5 Turbo DCT Panoramic"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Manufacturing Year</label>
                  <input
                    type="number"
                    value={manufacturingYear}
                    onChange={(e) => setManufacturingYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registration Year</label>
                  <input
                    type="number"
                    value={registrationYear}
                    onChange={(e) => setRegistrationYear(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Registration City & RTO</label>
                  <input
                    type="text"
                    value={registrationCity}
                    onChange={(e) => setRegistrationCity(e.target.value)}
                    placeholder="e.g. Nagpur (MH-31)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Technical Specifications */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-600" />
                <span>Technical Specifications</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Body Type</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="MUV">MUV</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kilometers Driven</label>
                  <input
                    type="number"
                    value={kilometers}
                    onChange={(e) => setKilometers(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ownership</label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none"
                  >
                    <option value="1st Owner">1st Owner</option>
                    <option value="2nd Owner">2nd Owner</option>
                    <option value="3rd Owner">3rd Owner</option>
                    <option value="4th+ Owner">4th+ Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exterior Color</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Engine Capacity</label>
                  <input
                    type="text"
                    value={engineCapacity}
                    onChange={(e) => setEngineCapacity(e.target.value)}
                    placeholder="e.g. 1493 cc"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Seating Capacity</label>
                  <input
                    type="number"
                    value={seatingCapacity}
                    onChange={(e) => setSeatingCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Pricing & Dealer Acquisition Margin */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Pricing & Internal Costing</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Asking Price (₹)</label>
                  <input
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-extrabold text-slate-900 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">Displays as: {formatPriceINR(askingPrice)}</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">RTO Transfer Charge (₹)</label>
                  <input
                    type="number"
                    value={rtoTransferFee}
                    onChange={(e) => setRtoTransferFee(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="negotiableToggle"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="accent-[#10151F]"
                />
                <label htmlFor="negotiableToggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Tag as "Price Negotiable" on public marketplace
                </label>
              </div>

              {/* Confidential Acquisition Cost */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-800 font-bold">
                  <Lock className="w-4 h-4" />
                  <span>Confidential Dealer Acquisition Price (Internal Only)</span>
                </div>
                <p className="text-[11px] text-amber-900/80 leading-relaxed">
                  Visible ONLY to authorized dealership management. Never shown to buyers or on public showroom pages.
                </p>
                <div className="pt-1">
                  <input
                    type="number"
                    value={acquisitionPrice}
                    onChange={(e) => setAcquisitionPrice(Number(e.target.value))}
                    className="bg-white border border-amber-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none w-60"
                  />
                  <span className="text-xs text-emerald-700 font-bold ml-3">
                    Projected Gross Margin: {formatPriceINR(askingPrice - acquisitionPrice)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Vehicle Condition & Disclosures */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Condition Disclosures</span>
              </h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Overall Inspection Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="A+">Grade A+ (Pristine Showroom Condition)</option>
                    <option value="A">Grade A (Very Good, Minor Usage Marks)</option>
                    <option value="B">Grade B (Normal Wear and Tear)</option>
                    <option value="C">Grade C (Economy/Budget Used)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Accident History Disclosure</label>
                  <select
                    value={accidentDisclosure}
                    onChange={(e) => setAccidentDisclosure(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                  >
                    <option value="Clean Record (No Accidents)">Clean Record (No Accidents)</option>
                    <option value="Minor Paint/Cosmetic Touchup">Minor Paint/Cosmetic Touchup</option>
                    <option value="Repaired Accident">Repaired Accident</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle Description Narrative</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Insurance Status</label>
                  <select
                    value={insuranceStatus}
                    onChange={(e) => setInsuranceStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Comprehensive">Comprehensive</option>
                    <option value="Zero Depreciation">Zero Depreciation</option>
                    <option value="Third-Party Only">Third-Party Only</option>
                    <option value="Expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Service History Records</label>
                  <select
                    value={serviceHistory}
                    onChange={(e) => setServiceHistory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
                  >
                    <option value="Full Authorized Service Records">Full Authorized Service Records</option>
                    <option value="Partial Service Records">Partial Service Records</option>
                    <option value="Self-Serviced">Self-Serviced</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Media & Inspection Report */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>Photographs & Inspection Checklist</span>
              </h4>

              {/* Primary Image */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Cover Photo URL</label>
                <input
                  type="text"
                  value={primaryImage}
                  onChange={(e) => setPrimaryImage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Gallery Images ({galleryImages.length})</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video group">
                      <img src={img} alt="Car" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste additional vehicle photo URL..."
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-xs text-slate-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Inspection Scores */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block font-bold text-slate-700 mb-2">150-Point Scores (Out of 10)</label>
                <div className="grid grid-cols-4 gap-3 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[10px] text-slate-500 mb-1">Engine</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={engineScore}
                      onChange={(e) => setEngineScore(Number(e.target.value))}
                      className="w-full text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[10px] text-slate-500 mb-1">Exterior</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={bodyScore}
                      onChange={(e) => setBodyScore(Number(e.target.value))}
                      className="w-full text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[10px] text-slate-500 mb-1">Interior</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={interiorScore}
                      onChange={(e) => setInteriorScore(Number(e.target.value))}
                      className="w-full text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1"
                    />
                  </div>

                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                    <label className="block text-[10px] text-slate-500 mb-1">Suspension</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="10"
                      value={suspensionScore}
                      onChange={(e) => setSuspensionScore(Number(e.target.value))}
                      className="w-full text-center font-bold text-sm bg-white border border-slate-200 rounded-lg py-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Review & Final Publish */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Review Listing Summary</span>
              </h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                <img
                  src={primaryImage}
                  alt={model}
                  className="w-24 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                />
                <div>
                  <h5 className="font-bold text-sm text-slate-900">
                    {manufacturingYear} {make} {model}
                  </h5>
                  <p className="text-xs text-slate-500">{variant}</p>
                  <p className="text-base font-extrabold text-[#10151F] mt-1">
                    Asking: {formatPriceINR(askingPrice)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Specifications</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    {fuelType} • {transmission} • {kilometers.toLocaleString('en-IN')} km • {ownership}
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Condition & Inspection</span>
                  <p className="font-semibold text-slate-800 mt-0.5">
                    Grade {grade} • {accidentDisclosure}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div></div>
          )}

          <div className="flex items-center gap-2">
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-5 py-2.5 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6F36B]" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handlePublish('inactive')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-100"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handlePublish('available')}
                  className="px-6 py-2.5 rounded-xl bg-[#C6F36B] text-[#10151F] font-extrabold text-xs hover:bg-[#b0df57] shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publish to Inventory</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
