import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { formatDate, timeAgo } from '@/utils/formatters';
import {
  FileText,
  Calendar,
  Building2,
  Clock,
  CheckCircle2,
  Phone,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const CustomerEnquiriesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [leads, setLeads] = useState(() => StorageService.getLeads());

  useEffect(() => {
    return subscribeToStore(() => {
      setLeads(StorageService.getLeads());
    });
  }, []);

  // Filter enquiries matching customer phone or recent
  const myEnquiries = leads.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <Link to="/" className="hover:text-slate-800">Home</Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">My Enquiries</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#182230]">
                My Vehicle Enquiries & Callbacks
              </h1>
              <p className="text-xs text-slate-500">
                Track status of your vehicle inquiries with dealerships
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {myEnquiries.map((enq) => {
            const dealer = StorageService.getDealerById(enq.dealerId);
            return (
              <div
                key={enq.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {enq.interestedVehicleImage ? (
                    <img
                      src={enq.interestedVehicleImage}
                      alt="Car"
                      className="w-20 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                    />
                  ) : (
                    <div className="w-20 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-slate-400" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 uppercase">
                        Stage: {enq.stage.replace('_', ' ')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {timeAgo(enq.enquiryDate)}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-sm text-[#182230]">
                      {enq.interestedVehicleTitle}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dealership: <strong>{dealer?.name || 'Authorized Dealer'}</strong></span>
                    </p>

                    {enq.notes.length > 0 && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-2 max-w-md">
                        Latest note: {enq.notes[0].text}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  {enq.interestedVehicleId && (
                    <Link
                      to={`/cars/${enq.interestedVehicleId}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
                    >
                      <span>View Vehicle</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  {dealer && (
                    <a
                      href={`tel:${dealer.contact.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C6F36B]" />
                      <span>Call Dealer</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
