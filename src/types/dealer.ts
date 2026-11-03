export type DealerVerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface DealerTheme {
  primaryColor: string; // e.g. #10151F or custom
  accentColor: string; // e.g. #C6F36B or custom
  bannerStyle: 'modern' | 'minimal' | 'bold';
  darkHeader: boolean;
  customWelcomeMessage?: string;
}

export interface DealerContact {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl?: string;
}

export interface Dealer {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  customDomain: string; // e.g. "omcars.com"
  logo: string;
  coverImage: string;
  verified: boolean;
  verificationStatus: DealerVerificationStatus;
  contact: DealerContact;
  about: string;
  rating: number; // Clearly flagged as sample data
  reviewsCount: number;
  establishedYear: number;
  theme: DealerTheme;
  subscriptionPlan: 'starter' | 'growth' | 'professional' | 'enterprise';
  subscriptionRenewalDate: string;
  activeListingsCount: number;
  documentsSubmitted?: {
    gstNumber: string;
    tradeLicenseUrl: string;
    idProofUrl: string;
  };
  createdAt: string;
}
