export type FuelType = 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid' | 'CNG';
export type TransmissionType = 'Manual' | 'Automatic';
export type BodyType = 'SUV' | 'Sedan' | 'Hatchback' | 'MUV' | 'Luxury' | 'Coupe';
export type OwnershipType = '1st Owner' | '2nd Owner' | '3rd Owner' | '4th+ Owner';
export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'inactive';
export type ModerationStatus = 'approved' | 'pending' | 'rejected' | 'flagged';

export interface VehicleSpecs {
  fuelType: FuelType;
  transmission: TransmissionType;
  kilometers: number;
  ownership: OwnershipType;
  bodyType: BodyType;
  engineCapacity?: string; // e.g. "1493 cc"
  mileage?: string; // e.g. "18.2 kmpl"
  color: string;
  seatingCapacity: number;
  rtoLocation: string; // e.g. "MH-31 Nagpur"
}

export interface VehiclePricing {
  askingPrice: number; // in INR
  negotiable: boolean;
  additionalCharges?: {
    rtoTransfer?: number;
    processingFee?: number;
    insuranceTransfer?: number;
  };
  acquisitionPrice?: number; // confidential dealer cost
}

export interface VehicleCondition {
  grade: 'A+' | 'A' | 'B' | 'C';
  description: string;
  accidentDisclosure: 'Clean Record (No Accidents)' | 'Minor Paint/Cosmetic Touchup' | 'Repaired Accident';
  repairDisclosure: string;
  insuranceStatus: 'Comprehensive' | 'Zero Depreciation' | 'Third-Party Only' | 'Expired';
  insuranceValidity?: string;
  serviceHistory: 'Full Authorized Service Records' | 'Partial Service Records' | 'Self-Serviced';
  tyreConditionPercent: number; // e.g. 85%
  batteryCondition: 'Excellent' | 'Good' | 'Needs Attention';
  knownIssues?: string;
}

export interface InspectionChecklist {
  engineTransmissionScore: number; // out of 10
  exteriorBodyScore: number;
  interiorElectronicsScore: number;
  steeringSuspensionScore: number;
  inspectionDate?: string;
  inspectorName?: string;
}

export interface Vehicle {
  id: string;
  slug: string;
  dealerId: string;
  dealerName: string;
  dealerSlug: string;
  dealerCity: string;
  dealerVerified: boolean;
  dealerPhone: string;
  dealerWhatsapp: string;

  // Basic info
  make: string; // Brand e.g. Hyundai, Tata, Mahindra, Toyota
  model: string; // e.g. Creta, Thar, Fortuner
  variant: string; // e.g. SX (O) 1.5 Turbo Petrol
  manufacturingYear: number;
  registrationYear: number;
  registrationCity: string;

  // Technical & Condition
  specs: VehicleSpecs;
  pricing: VehiclePricing;
  condition: VehicleCondition;
  inspection?: InspectionChecklist;

  // Media
  images: string[];
  primaryImage: string;
  videoUrl?: string;

  // Status & Moderation
  status: VehicleStatus;
  moderationStatus: ModerationStatus;
  moderationNote?: string;

  // Flags & Analytics
  isFeatured: boolean;
  viewsCount: number;
  enquiriesCount: number;
  qrScansCount: number;

  createdAt: string;
  updatedAt: string;
}
