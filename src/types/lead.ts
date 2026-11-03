export type LeadStage =
  | 'new'
  | 'contacted'
  | 'interested'
  | 'visit_scheduled'
  | 'test_drive_scheduled'
  | 'negotiation'
  | 'converted'
  | 'lost';

export type LeadSource =
  | 'Antilog marketplace'
  | 'Dealer website'
  | 'WhatsApp'
  | 'Instagram'
  | 'OLX'
  | 'CarDekho'
  | 'Google Business'
  | 'Walk-in'
  | 'Phone call'
  | 'Other';

export interface LeadActivity {
  id: string;
  type: 'call' | 'whatsapp' | 'note' | 'stage_change' | 'appointment' | 'system';
  title: string;
  description: string;
  timestamp: string;
  authorName: string;
}

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  authorName: string;
}

export interface Lead {
  id: string;
  dealerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  customerCity: string;
  interestedVehicleId?: string;
  interestedVehicleTitle: string;
  interestedVehicleImage?: string;
  interestedVehiclePrice?: number;
  customerBudget?: number;
  source: LeadSource;
  stage: LeadStage;
  assignedSalespersonId?: string;
  assignedSalespersonName: string;
  nextFollowUpDate?: string;
  nextFollowUpNote?: string;
  lostReason?: string;
  notes: LeadNote[];
  timeline: LeadActivity[];
  enquiryDate: string;
  updatedAt: string;
}
