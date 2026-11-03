import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatPriceINR, formatDate } from '@/utils/formatters';
import {
  Users,
  Search,
  Sparkles,
  Phone,
  CheckCircle2,
  Building2,
  MapPin,
} from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();

  const requirements = StorageService.getRequirements();
  const allLeads = StorageService.getLeads();

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Customer Requirements & Platform Inquiries"
        subtitle="Review broadcasted buyer requests, dealer lead distribution, and customer matching velocity"
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Customer Requirements Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#54D7E8]" />
                <span>Customer Vehicle Requirements Directory ({requirements.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                Buyers requesting specific vehicles dispatched across registered dealerships
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{req.customerName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {req.preferredCity}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Status: {req.status}
                    </span>
                  </div>

                  <p className="text-slate-800 font-semibold text-xs">
                    Looking for: <span className="text-blue-600">{req.brand} {req.preferredModel}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Budget: {formatPriceINR(req.budgetMin)} - {formatPriceINR(req.budgetMax)} • {req.fuelType} • {req.transmission}
                  </p>
                  {req.additionalRequirements && (
                    <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 max-w-xl">
                      "{req.additionalRequirements}"
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">{req.mobileNumber}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Prefers: {req.preferredContactMethod}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block">
                    ✓ Consent Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Leads Volume Across Platform */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900">
            Platform Enquiries Distributed to Dealers ({allLeads.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Target Dealership</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allLeads.slice(0, 10).map((lead) => {
                  const dealer = StorageService.getDealerById(lead.dealerId);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4 font-bold text-slate-900">{lead.customerName}</td>
                      <td className="py-3.5 px-3 truncate max-w-xs">{lead.interestedVehicleTitle}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-800">
                        {dealer?.name || 'Dealership'}
                      </td>
                      <td className="py-3.5 px-3">{lead.source}</td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold uppercase text-[10px] text-blue-700">
                          {lead.stage.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
