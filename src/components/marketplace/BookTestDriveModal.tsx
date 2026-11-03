import React, { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceINR } from '@/utils/formatters';
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  MapPin,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface BookTestDriveModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const BookTestDriveModal: React.FC<BookTestDriveModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [date, setDate] = useState('2026-11-06');
  const [time, setTime] = useState('11:00 AM');
  const [appointmentType, setAppointmentType] = useState<
    'Test drive' | 'Home test-drive request' | 'Showroom visit'
  >('Test drive');
  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number');
      return;
    }

    // 1. Create appointment record
    const aptId = 'apt-' + Date.now();
    StorageService.saveAppointment({
      id: aptId,
      dealerId: vehicle.dealerId,
      customerName: name,
      customerPhone: phone,
      vehicleId: vehicle.id,
      vehicleTitle: `${vehicle.make} ${vehicle.model} (${vehicle.variant})`,
      vehicleImage: vehicle.primaryImage,
      appointmentType,
      date,
      time,
      assignedSalesperson: 'Assigned on arrival',
      notes: notes || undefined,
      status: 'Requested',
      createdAt: new Date().toISOString(),
    });

    // 2. Automatically generate or update CRM lead for dealer
    const leadId = 'lead-' + Date.now();
    StorageService.saveLead({
      id: leadId,
      dealerId: vehicle.dealerId,
      customerName: name,
      customerPhone: phone,
      customerCity: vehicle.dealerCity,
      interestedVehicleId: vehicle.id,
      interestedVehicleTitle: `${vehicle.make} ${vehicle.model} (${vehicle.variant})`,
      interestedVehicleImage: vehicle.primaryImage,
      interestedVehiclePrice: vehicle.pricing.askingPrice,
      customerBudget: vehicle.pricing.askingPrice,
      source: 'Antilog marketplace',
      stage: 'test_drive_scheduled',
      assignedSalespersonName: 'Unassigned',
      nextFollowUpDate: date,
      nextFollowUpNote: `${appointmentType} scheduled for ${time}`,
      notes: [
        {
          id: 'note-' + Date.now(),
          text: `Customer booked ${appointmentType} for ${date} at ${time}. ${notes ? `Note: ${notes}` : ''}`,
          createdAt: new Date().toISOString(),
          authorName: 'Marketplace Automation',
        },
      ],
      timeline: [
        {
          id: 'act-' + Date.now(),
          type: 'appointment',
          title: `${appointmentType} Booked`,
          description: `Scheduled on ${date} at ${time}`,
          timestamp: new Date().toISOString(),
          authorName: name,
        },
      ],
      enquiryDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsSubmitted(true);
    success(
      'Test Drive Booked!',
      `Your appointment with ${vehicle.dealerName} has been submitted. A confirmation SMS will be sent.`
    );
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Modal Header */}
        <div className="bg-[#10151F] text-white p-5 flex items-center justify-between border-b border-[#233044]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#182231] border border-[#C6F36B]/40 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#C6F36B]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Book Test Drive / Visit</h3>
              <p className="text-xs text-slate-400">Directly with {vehicle.dealerName}</p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Appointment Requested!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your test drive for <span className="font-semibold text-slate-900">{vehicle.make} {vehicle.model}</span> is booked for <span className="font-semibold text-slate-900">{date} at {time}</span> with <span className="font-semibold text-slate-900">{vehicle.dealerName}</span>.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <p>📍 <strong>Dealership Address:</strong> {vehicle.dealerCity}</p>
              <p>📞 <strong>Dealer Contact:</strong> {vehicle.dealerPhone}</p>
              <p>🆔 <strong>Booking Reference:</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Vehicle Preview Card */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <img
                src={vehicle.primaryImage}
                alt={vehicle.model}
                className="w-16 h-12 object-cover rounded-lg shrink-0"
              />
              <div className="overflow-hidden">
                <h5 className="font-bold text-slate-900 truncate">
                  {vehicle.manufacturingYear} {vehicle.make} {vehicle.model}
                </h5>
                <p className="text-slate-500 text-[11px] truncate">{vehicle.variant}</p>
                <p className="font-extrabold text-[#10151F] mt-0.5">
                  {formatPriceINR(vehicle.pricing.askingPrice)}
                </p>
              </div>
            </div>

            {/* Appointment Type Choice */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Appointment Type</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Test drive', label: 'Showroom Drive' },
                  { id: 'Home test-drive request', label: 'Home Test Drive' },
                  { id: 'Showroom visit', label: 'Showroom Visit' },
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setAppointmentType(type.id as any)}
                    className={`py-2 px-1 text-center rounded-xl border font-semibold text-[11px] transition-all ${
                      appointmentType === type.id
                        ? 'bg-[#10151F] text-[#C6F36B] border-[#10151F] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date and Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white"
                >
                  <option value="10:30 AM">10:30 AM - Morning</option>
                  <option value="11:00 AM">11:00 AM</option>
                  <option value="02:30 PM">02:30 PM - Afternoon</option>
                  <option value="04:00 PM">04:00 PM - Evening</option>
                  <option value="05:30 PM">05:30 PM - Late Evening</option>
                </select>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Special Notes / Requirements</label>
              <textarea
                rows={2}
                placeholder="e.g. Please bring vehicle to Ramdaspeth, or I want to test parking clearance"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
              ></textarea>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#C6F36B]" />
                <span>Confirm Test Drive Booking</span>
              </button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                No charges or payment required. The dealership will contact you to verify slot.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
