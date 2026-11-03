export type AppointmentType =
  | 'Showroom visit'
  | 'Test drive'
  | 'Phone call'
  | 'Video meeting'
  | 'Home test-drive request';

export type AppointmentStatus =
  | 'Requested'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'No-show';

export interface Appointment {
  id: string;
  dealerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  vehicleId: string;
  vehicleTitle: string;
  vehicleImage: string;
  appointmentType: AppointmentType;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "11:00 AM"
  assignedSalesperson: string;
  notes?: string;
  status: AppointmentStatus;
  createdAt: string;
}
