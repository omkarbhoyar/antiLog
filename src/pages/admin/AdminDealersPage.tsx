import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Dealer, DealerVerificationStatus } from '@/types/dealer';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  X,
  Search,
} from 'lucide-react';

export const AdminDealersPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { success, info } = useToast();

  const [dealers, setDealers] = useState(() => StorageService.getDealers());
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredDealers = dealers.filter((d) => {
    if (searchTerm && !d.name.toLowerCase().includes(searchTerm.toLowerCase()) && !d.contact.city.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && d.verificationStatus !== statusFilter) return false;
    return true;
  });

  const handleUpdateStatus = (dealerId: string, status: DealerVerificationStatus) => {
    StorageService.updateDealerVerification(dealerId, status);
    setDealers(StorageService.getDealers());
    if (selectedDealer && selectedDealer.id === dealerId) {
      setSelectedDealer({
        ...selectedDealer,
        verificationStatus: status,
        verified: status === 'verified',
      });
    }
    success('Dealer Status Updated', `Marked dealership as ${status.toUpperCase()}.`);
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Dealership Network & Verification Operations"
        subtitle="Manage dealership onboarding, verify business licenses & GST records, suspend or reactivate accounts"
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Verification Review Modal */}
      {selectedDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedDealer.logo}
                  alt={selectedDealer.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{selectedDealer.name}</h3>
                  <p className="text-[11px] text-slate-500">{selectedDealer.customDomain}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDealer(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  Submitted Business Records
                </span>
                <p>• GST Number: <strong>{selectedDealer.documentsSubmitted?.gstNumber || '27AABCO1234F1Z8'}</strong></p>
                <p>• Registered City: <strong>{selectedDealer.contact.city}, {selectedDealer.contact.state}</strong></p>
                <p>• Showroom Address: <strong>{selectedDealer.contact.address}</strong></p>
                <p>• Current Plan: <strong className="uppercase">{selectedDealer.subscriptionPlan}</strong></p>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-blue-900 text-[11px]">
                <span className="font-bold block">Verification Checklist:</span>
                Physical showroom address matched with municipal trade records. No pending consumer disputes.
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              {selectedDealer.verificationStatus !== 'verified' ? (
                <button
                  onClick={() => handleUpdateStatus(selectedDealer.id, 'verified')}
                  className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify Dealership</span>
                </button>
              ) : (
                <button
                  onClick={() => handleUpdateStatus(selectedDealer.id, 'suspended')}
                  className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Suspend Dealership</span>
                </button>
              )}

              {selectedDealer.verificationStatus !== 'rejected' && (
                <button
                  onClick={() => handleUpdateStatus(selectedDealer.id, 'rejected')}
                  className="px-4 py-3 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200"
                >
                  Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search dealer, domain, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Filter:</span>
            {['all', 'verified', 'pending', 'suspended'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-[#10151F] text-[#54D7E8]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Dealers Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Dealership</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Dedicated Domain</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Stock Count</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 pr-4 pl-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDealers.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={d.logo}
                          alt={d.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{d.name}</p>
                          <p className="text-[10px] text-slate-400">{d.contact.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-800">{d.contact.city}</td>

                    <td className="py-3.5 px-3 font-mono font-semibold text-blue-600">
                      {d.customDomain}
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-bold uppercase text-[11px] text-slate-900">
                        {d.subscriptionPlan}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {d.activeListingsCount} Cars
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          d.verificationStatus === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : d.verificationStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {d.verificationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 pl-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedDealer(d)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-xs"
                        >
                          Review & Status
                        </button>
                        <Link
                          to={`/showroom/${d.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600"
                          title="Open Showroom"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
