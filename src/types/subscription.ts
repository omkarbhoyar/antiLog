export type PlanTier = 'starter' | 'growth' | 'professional' | 'enterprise';

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: string;
}

export interface SubscriptionPlan {
  id: PlanTier;
  name: string;
  tagline: string;
  monthlyPrice: number;
  annualPrice: number;
  vehicleLimit: number;
  userLimit: number;
  isPopular?: boolean;
  features: string[];
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  planName: string;
  status: 'Paid' | 'Pending' | 'Failed';
  downloadUrl?: string;
}

export interface DealerSubscriptionState {
  currentPlanId: PlanTier;
  billingCycle: 'monthly' | 'yearly';
  renewalDate: string;
  status: 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
  activeVehiclesCount: number;
  vehicleLimit: number;
  invoices: Invoice[];
}
