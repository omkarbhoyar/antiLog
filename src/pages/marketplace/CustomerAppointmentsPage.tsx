import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { formatDate } from '@/utils/formatters';
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  MapPin,
  Car,
  ExternalLink,
} from 'lucide-react';

export const CustomerAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState(() => StorageService.getAppointments());

  useEffect(() => {
    return subscribeToStore(() => {
      setAppointments(StorageService.getAppointments());
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">My Appointments</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                My Test Drives & Showroom Visits
              </h1>
              <p className="text-xs text-slate-500">
                Confirmed schedules with dealership staff and sales managers
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {appointments.slice(0, 6).map((apt) => {
            const dealer = StorageService.getDealerById(apt.dealerId);
            return (
              <div
                key={apt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={apt.vehicleImage}
                    alt={apt.vehicleTitle}
                    className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : apt.status === 'Completed'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {apt.appointmentType}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-[#182230]">{apt.vehicleTitle}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-900">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        {formatDate(apt.date)} at {apt.time}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {dealer?.name} ({dealer?.contact.city})
                      </span>
                    </div>

                    {apt.notes && (
                      <p className="text-[11px] text-slate-500 italic mt-1.5">Note: {apt.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Link
                    to={`/cars/${apt.vehicleId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                  >
                    <span>View Car</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    to={`/showroom/${dealer?.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] transition-colors"
                  >
                    <span>Showroom</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
