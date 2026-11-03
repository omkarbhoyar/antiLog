import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { Appointment, AppointmentStatus, AppointmentType } from '@/types/appointment';
import { formatDate } from '@/utils/formatters';
import {
  Calendar,
  Clock,
  Car,
  User,
  Phone,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Check,
  X,
} from 'lucide-react';

export const DealerAppointmentsPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [appointments, setAppointments] = useState(() => StorageService.getAppointments(dealer.id));
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New appointment form state
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [aptType, setAptType] = useState<AppointmentType>('Test drive');
  const [aptDate, setAptDate] = useState('2026-11-06');
  const [aptTime, setAptTime] = useState('11:30 AM');
  const [assignedSalesperson, setAssignedSalesperson] = useState('Rajesh Agrawal');
  const [notes, setNotes] = useState('');

  const dealerCars = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);

  useEffect(() => {
    return subscribeToStore(() => {
      setAppointments(StorageService.getAppointments(dealer.id));
    });
  }, [dealer.id]);

  const filtered = appointments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const handleStatusUpdate = (aptId: string, newStatus: AppointmentStatus) => {
    StorageService.updateAppointmentStatus(aptId, newStatus);
    success('Appointment Updated', `Status changed to ${newStatus}.`);
  };

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custPhone) return;

    const car = dealerCars.find((v) => v.id === selectedVehicleId) || dealerCars[0];

    const newApt: Appointment = {
      id: 'apt-' + Date.now(),
      dealerId: dealer.id,
      customerName: custName,
      customerPhone: custPhone,
      vehicleId: car?.id || 'veh-01',
      vehicleTitle: car ? `${car.make} ${car.model} (${car.variant})` : 'Vehicle Test Drive',
      vehicleImage: car?.primaryImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400',
      appointmentType: aptType,
      date: aptDate,
      time: aptTime,
      assignedSalesperson,
      notes,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    StorageService.saveAppointment(newApt);
    setIsModalOpen(false);
    setCustName('');
    setCustPhone('');
    setNotes('');
    success('Appointment Created', `Scheduled ${aptType} on ${aptDate}.`);
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Test Drive & Appointment Manager"
        subtitle={`Schedule and track customer visits, highway test drives, and home vehicle demos`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Add Appointment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">Schedule New Appointment</h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={custName}
                    onChange={(e) => setCustName(e.target.value)}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vehicle</label>
                <select
                  value={selectedVehicleId}
                  onChange={(e) => setSelectedVehicleId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  {dealerCars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.manufacturingYear} {c.make} {c.model} - {c.variant}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={aptType}
                    onChange={(e) => setAptType(e.target.value as AppointmentType)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="Test drive">Test Drive</option>
                    <option value="Showroom visit">Showroom Visit</option>
                    <option value="Home test-drive request">Home Test Drive</option>
                    <option value="Video meeting">Video Meeting</option>
                    <option value="Phone call">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <select
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-xs"
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Sales Executive</label>
                <select
                  value={assignedSalesperson}
                  onChange={(e) => setAssignedSalesperson(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                >
                  <option value="Pooja Sharma">Pooja Sharma (Sales Manager)</option>
                  <option value="Rajesh Agrawal">Rajesh Agrawal (Sales Executive)</option>
                  <option value="Om Prakash Mundada">Om Prakash Mundada (Owner)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Requested highway spin, bring car to Ramdaspeth"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all"
              >
                Schedule & Confirm
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Top Control Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
            {['all', 'Confirmed', 'Requested', 'Completed', 'Cancelled', 'No-show'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-[#10151F] text-[#C6F36B]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'all' ? 'All' : st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold shadow-sm self-end"
          >
            <Plus className="w-4 h-4 text-[#C6F36B]" />
            <span>Schedule Appointment</span>
          </button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
              <h3 className="font-bold text-base text-slate-800">No appointments found</h3>
              <p className="text-xs text-slate-500">No appointments match selected status.</p>
            </div>
          ) : (
            filtered.map((apt) => (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={apt.vehicleImage}
                    alt="Vehicle"
                    className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : apt.status === 'Cancelled'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-700">
                        {apt.appointmentType}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-[#182230]">{apt.vehicleTitle}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                      <span className="font-bold text-slate-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {formatDate(apt.date)} at {apt.time}
                      </span>
                      <span>•</span>
                      <span>Customer: <strong>{apt.customerName}</strong> ({apt.customerPhone})</span>
                      <span>•</span>
                      <span>Staff: <strong>{apt.assignedSalesperson}</strong></span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1">Note: {apt.notes}</p>
                    )}
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                  {apt.status === 'Requested' && (
                    <button
                      onClick={() => handleStatusUpdate(apt.id, 'Confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Confirm Booking
                    </button>
                  )}
                  {apt.status === 'Confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(apt.id, 'Completed')}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                    >
                      Mark Completed
                    </button>
                  )}
                  {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                    <button
                      onClick={() => handleStatusUpdate(apt.id, 'Cancelled')}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-xs"
                    >
                      Cancel
                    </button>
                  )}
                  <a
                    href={`tel:${apt.customerPhone}`}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
