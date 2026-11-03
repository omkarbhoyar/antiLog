import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Vehicle, ModerationStatus } from '@/types/vehicle';
import { formatPriceINR, formatKilometers } from '@/utils/formatters';
import {
  Car,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Search,
  Eye,
  X,
} from 'lucide-react';

export const AdminListingsModerationPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { success, error } = useToast();

  const [vehicles, setVehicles] = useState(() => StorageService.getVehicles());
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [modNote, setModNote] = useState('');

  const filtered = vehicles.filter((v) => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      if (!v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q) && !v.dealerName.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (statusFilter !== 'all' && v.moderationStatus !== statusFilter) return false;
    return true;
  });

  const handleModeration = (vId: string, status: ModerationStatus) => {
    StorageService.updateVehicleModeration(vId, status, modNote);
    setVehicles(StorageService.getVehicles());
    setSelectedVehicle(null);
    setModNote('');
    success('Listing Moderated', `Vehicle listing marked as ${status.toUpperCase()}.`);
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Vehicle Listing Moderation Queue"
        subtitle="Ensure authentic vehicle photography, verify RTO registration details, and prevent deceptive listings"
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Review Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">Moderate Vehicle Listing</h3>
              <button onClick={() => setSelectedVehicle(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <img
                src={selectedVehicle.primaryImage}
                alt="Car"
                className="w-20 h-14 object-cover rounded-lg shrink-0"
              />
              <div className="overflow-hidden">
                <h5 className="font-bold text-slate-900 truncate">
                  {selectedVehicle.manufacturingYear} {selectedVehicle.make} {selectedVehicle.model}
                </h5>
                <p className="text-[11px] text-slate-500">{selectedVehicle.variant}</p>
                <p className="font-extrabold text-[#10151F]">
                  Asking: {formatPriceINR(selectedVehicle.pricing.askingPrice)}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p>• Dealership: <strong>{selectedVehicle.dealerName}</strong> ({selectedVehicle.dealerCity})</p>
              <p>• RTO Registration: <strong>{selectedVehicle.specs.rtoLocation}</strong></p>
              <p>• Inspection Grade: <strong>Grade {selectedVehicle.condition.grade}</strong></p>
              <p>• Accident Disclosure: <strong>{selectedVehicle.condition.accidentDisclosure}</strong></p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Moderator Audit Note (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Images verified, clear title records confirmed"
                value={modNote}
                onChange={(e) => setModNote(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs"
              />
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleModeration(selectedVehicle.id, 'approved')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
              >
                Approve Listing
              </button>
              <button
                onClick={() => handleModeration(selectedVehicle.id, 'flagged')}
                className="px-3 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600"
              >
                Flag Listing
              </button>
              <button
                onClick={() => handleModeration(selectedVehicle.id, 'rejected')}
                className="px-3 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search vehicle model, dealer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold">Status:</span>
            {['all', 'approved', 'pending', 'flagged', 'rejected'].map((st) => (
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

        {/* Listings Moderation Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Vehicle</th>
                  <th className="py-3 px-3">Dealership</th>
                  <th className="py-3 px-3">Asking Price</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3">Moderation</th>
                  <th className="py-3 pr-4 pl-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={v.primaryImage}
                          alt={v.model}
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">
                            {v.manufacturingYear} {v.make} {v.model}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate max-w-xs">{v.variant}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-900">{v.dealerName}</p>
                      <p className="text-[10px] text-slate-400">{v.dealerCity}</p>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {formatPriceINR(v.pricing.askingPrice)}
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      Grade {v.condition.grade}
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          v.moderationStatus === 'approved'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : v.moderationStatus === 'pending'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        {v.moderationStatus}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 pl-2 text-right">
                      <button
                        onClick={() => setSelectedVehicle(v)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-800 text-xs"
                      >
                        Moderate
                      </button>
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
