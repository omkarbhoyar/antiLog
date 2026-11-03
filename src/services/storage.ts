import { Vehicle } from '@/types/vehicle';
import { Dealer } from '@/types/dealer';
import { Lead, LeadStage, LeadNote, LeadActivity } from '@/types/lead';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { TeamMember } from '@/types/auth';
import { CustomerRequirement } from '@/types/requirement';
import { SubscriptionPlan, Invoice } from '@/types/subscription';
import { INITIAL_DEALERS } from './mockData/dealers';
import { INITIAL_VEHICLES } from './mockData/vehicles';
import { INITIAL_LEADS } from './mockData/leads';
import { INITIAL_APPOINTMENTS } from './mockData/appointments';
import { INITIAL_TEAM } from './mockData/team';
import { SUBSCRIPTION_PLANS, MOCK_INVOICES } from './mockData/subscriptions';

const STORAGE_KEYS = {
  VEHICLES: 'antilog_vehicles_v1',
  DEALERS: 'antilog_dealers_v1',
  LEADS: 'antilog_leads_v1',
  APPOINTMENTS: 'antilog_appointments_v1',
  TEAM: 'antilog_team_v1',
  REQUIREMENTS: 'antilog_requirements_v1',
  FAVORITES: 'antilog_favorites_v1',
  PLANS: 'antilog_plans_v1',
  INVOICES: 'antilog_invoices_v1',
};

// Listeners for multi-component reactivity
type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeToStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error(e);
    }
  });
}

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (err) {
    console.error('Storage write error', err);
  }
}

export const StorageService = {
  // Reset all to demo initial state
  resetToDefault() {
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.DEALERS);
    localStorage.removeItem(STORAGE_KEYS.LEADS);
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.REQUIREMENTS);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.PLANS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    notify();
  },

  // VEHICLES
  getVehicles(): Vehicle[] {
    return getStored<Vehicle[]>(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
  },
  getVehicleById(id: string): Vehicle | undefined {
    return this.getVehicles().find((v) => v.id === id);
  },
  getVehicleBySlug(slug: string): Vehicle | undefined {
    return this.getVehicles().find((v) => v.slug === slug);
  },
  saveVehicle(vehicle: Vehicle): void {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex((v) => v.id === vehicle.id);
    if (index >= 0) {
      vehicles[index] = { ...vehicle, updatedAt: new Date().toISOString() };
    } else {
      vehicles.unshift(vehicle);
    }
    setStored(STORAGE_KEYS.VEHICLES, vehicles);
  },
  updateVehicleStatus(id: string, status: Vehicle['status']): void {
    const vehicles = this.getVehicles();
    const target = vehicles.find((v) => v.id === id);
    if (target) {
      target.status = status;
      target.updatedAt = new Date().toISOString();
      setStored(STORAGE_KEYS.VEHICLES, vehicles);
    }
  },
  updateVehicleModeration(id: string, moderationStatus: Vehicle['moderationStatus'], note?: string): void {
    const vehicles = this.getVehicles();
    const target = vehicles.find((v) => v.id === id);
    if (target) {
      target.moderationStatus = moderationStatus;
      if (note) target.moderationNote = note;
      target.updatedAt = new Date().toISOString();
      setStored(STORAGE_KEYS.VEHICLES, vehicles);
    }
  },
  deleteVehicle(id: string): void {
    const vehicles = this.getVehicles().filter((v) => v.id !== id);
    setStored(STORAGE_KEYS.VEHICLES, vehicles);
  },

  // DEALERS
  getDealers(): Dealer[] {
    return getStored<Dealer[]>(STORAGE_KEYS.DEALERS, INITIAL_DEALERS);
  },
  getDealerById(id: string): Dealer | undefined {
    return this.getDealers().find((d) => d.id === id);
  },
  getDealerBySlug(slug: string): Dealer | undefined {
    return this.getDealers().find((d) => d.slug === slug || d.customDomain === slug);
  },
  saveDealer(dealer: Dealer): void {
    const dealers = this.getDealers();
    const index = dealers.findIndex((d) => d.id === dealer.id);
    if (index >= 0) {
      dealers[index] = dealer;
    } else {
      dealers.unshift(dealer);
    }
    setStored(STORAGE_KEYS.DEALERS, dealers);
  },
  updateDealerVerification(id: string, status: Dealer['verificationStatus']): void {
    const dealers = this.getDealers();
    const target = dealers.find((d) => d.id === id);
    if (target) {
      target.verificationStatus = status;
      target.verified = status === 'verified';
      setStored(STORAGE_KEYS.DEALERS, dealers);
    }
  },

  // LEADS
  getLeads(dealerId?: string): Lead[] {
    const all = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    if (dealerId) {
      return all.filter((l) => l.dealerId === dealerId);
    }
    return all;
  },
  getLeadById(id: string): Lead | undefined {
    return getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS).find((l) => l.id === id);
  },
  saveLead(lead: Lead): void {
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const index = leads.findIndex((l) => l.id === lead.id);
    if (index >= 0) {
      leads[index] = { ...lead, updatedAt: new Date().toISOString() };
    } else {
      leads.unshift(lead);
    }
    setStored(STORAGE_KEYS.LEADS, leads);
  },
  updateLeadStage(id: string, stage: LeadStage, lostReason?: string): void {
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const target = leads.find((l) => l.id === id);
    if (target) {
      const oldStage = target.stage;
      target.stage = stage;
      if (lostReason) target.lostReason = lostReason;
      target.updatedAt = new Date().toISOString();
      const activity: LeadActivity = {
        id: 'act-' + Date.now(),
        type: 'stage_change',
        title: `Stage changed: ${oldStage} -> ${stage}`,
        description: lostReason ? `Reason: ${lostReason}` : `Updated to ${stage.replace('_', ' ')}`,
        timestamp: new Date().toISOString(),
        authorName: 'System / Sales User',
      };
      target.timeline.unshift(activity);
      setStored(STORAGE_KEYS.LEADS, leads);
    }
  },
  addLeadNote(leadId: string, text: string, authorName: string): void {
    const leads = getStored<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    const target = leads.find((l) => l.id === leadId);
    if (target) {
      const note: LeadNote = {
        id: 'note-' + Date.now(),
        text,
        createdAt: new Date().toISOString(),
        authorName,
      };
      target.notes.unshift(note);
      target.timeline.unshift({
        id: 'act-' + Date.now(),
        type: 'note',
        title: 'Note added',
        description: text,
        timestamp: new Date().toISOString(),
        authorName,
      });
      setStored(STORAGE_KEYS.LEADS, leads);
    }
  },

  // APPOINTMENTS
  getAppointments(dealerId?: string): Appointment[] {
    const all = getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    if (dealerId) {
      return all.filter((a) => a.dealerId === dealerId);
    }
    return all;
  },
  saveAppointment(appointment: Appointment): void {
    const list = getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const index = list.findIndex((a) => a.id === appointment.id);
    if (index >= 0) {
      list[index] = appointment;
    } else {
      list.unshift(appointment);
    }
    setStored(STORAGE_KEYS.APPOINTMENTS, list);
  },
  updateAppointmentStatus(id: string, status: AppointmentStatus): void {
    const list = getStored<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const target = list.find((a) => a.id === id);
    if (target) {
      target.status = status;
      setStored(STORAGE_KEYS.APPOINTMENTS, list);
    }
  },

  // TEAM
  getTeam(dealerId?: string): TeamMember[] {
    const all = getStored<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM);
    if (dealerId) {
      return all.filter((t) => t.dealerId === dealerId);
    }
    return all;
  },
  saveTeamMember(member: TeamMember): void {
    const list = getStored<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM);
    const index = list.findIndex((t) => t.id === member.id);
    if (index >= 0) {
      list[index] = member;
    } else {
      list.push(member);
    }
    setStored(STORAGE_KEYS.TEAM, list);
  },
  deleteTeamMember(id: string): void {
    const list = getStored<TeamMember[]>(STORAGE_KEYS.TEAM, INITIAL_TEAM).filter((t) => t.id !== id);
    setStored(STORAGE_KEYS.TEAM, list);
  },

  // REQUIREMENTS
  getRequirements(): CustomerRequirement[] {
    const initial: CustomerRequirement[] = [
      {
        id: 'req-01',
        brand: 'Hyundai',
        preferredModel: 'Creta Automatic',
        budgetMin: 1000000,
        budgetMax: 1400000,
        fuelType: 'Petrol',
        transmission: 'Automatic',
        bodyType: 'SUV',
        preferredCity: 'Nagpur',
        additionalRequirements: 'Prefer 2021+ model with sunroof, less than 40k km driven.',
        customerName: 'Ashish Deshmukh',
        mobileNumber: '+91 98222 33445',
        preferredContactMethod: 'WhatsApp',
        consentShared: true,
        status: 'Matched',
        matchedVehiclesCount: 3,
        createdAt: '2026-11-01T10:00:00Z',
      },
      {
        id: 'req-02',
        brand: 'Mahindra',
        preferredModel: 'Thar 4x4 Hardtop',
        budgetMin: 1400000,
        budgetMax: 1700000,
        fuelType: 'Diesel',
        transmission: 'Automatic',
        bodyType: 'SUV',
        preferredCity: 'Mumbai',
        additionalRequirements: 'Black color only, single owner.',
        customerName: 'Samir Sethi',
        mobileNumber: '+91 98200 12345',
        preferredContactMethod: 'Phone Call',
        consentShared: true,
        status: 'Open',
        matchedVehiclesCount: 1,
        createdAt: '2026-11-02T15:30:00Z',
      }
    ];
    return getStored<CustomerRequirement[]>(STORAGE_KEYS.REQUIREMENTS, initial);
  },
  saveRequirement(req: CustomerRequirement): void {
    const list = this.getRequirements();
    list.unshift(req);
    setStored(STORAGE_KEYS.REQUIREMENTS, list);
  },

  // FAVORITES
  getFavorites(): string[] {
    return getStored<string[]>(STORAGE_KEYS.FAVORITES, ['veh-01', 'veh-02', 'veh-04']);
  },
  toggleFavorite(vehicleId: string): boolean {
    const favs = this.getFavorites();
    const index = favs.indexOf(vehicleId);
    let isAdded = false;
    if (index >= 0) {
      favs.splice(index, 1);
    } else {
      favs.push(vehicleId);
      isAdded = true;
    }
    setStored(STORAGE_KEYS.FAVORITES, favs);
    return isAdded;
  },
  isFavorite(vehicleId: string): boolean {
    return this.getFavorites().includes(vehicleId);
  },

  // PLANS
  getPlans(): SubscriptionPlan[] {
    return getStored<SubscriptionPlan[]>(STORAGE_KEYS.PLANS, SUBSCRIPTION_PLANS);
  },
  savePlan(plan: SubscriptionPlan): void {
    const list = this.getPlans();
    const idx = list.findIndex((p) => p.id === plan.id);
    if (idx >= 0) list[idx] = plan;
    setStored(STORAGE_KEYS.PLANS, list);
  },

  // INVOICES
  getInvoices(): Invoice[] {
    return getStored<Invoice[]>(STORAGE_KEYS.INVOICES, MOCK_INVOICES);
  }
};
