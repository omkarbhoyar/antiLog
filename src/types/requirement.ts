export interface CustomerRequirement {
  id: string;
  brand: string;
  preferredModel: string;
  budgetMin: number;
  budgetMax: number;
  fuelType: string;
  transmission: string;
  bodyType: string;
  preferredCity: string;
  additionalRequirements?: string;
  customerName: string;
  mobileNumber: string;
  preferredContactMethod: 'WhatsApp' | 'Phone Call' | 'Any';
  consentShared: boolean;
  status: 'Open' | 'Matched' | 'Fulfilled' | 'Closed';
  matchedVehiclesCount?: number;
  createdAt: string;
}
