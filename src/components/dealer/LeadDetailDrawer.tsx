import React, { useState } from 'react';
import { Lead, LeadStage, LeadSource } from '@/types/lead';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { formatPriceINR, formatDate, timeAgo } from '@/utils/formatters';
import {
  X,
  Phone,
  MessageCircle,
  Calendar,
  Clock,
  User,
  MapPin,
  Car,
  FileText,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Sparkles,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdated?: () => void;
}

const STAGES: { id: LeadStage; label: string }[] = [
  { id: 'new', label: 'New Lead' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'interested', label: 'Interested' },
  { id: 'visit_scheduled', label: 'Visit Scheduled' },
  { id: 'test_drive_scheduled', label: 'Test Drive Scheduled' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'converted', label: 'Converted Deal' },
  { id: 'lost', label: 'Lost Lead' },
];

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdated,
}) => {
  const { success } = useToast();
  const [newNote, setNewNote] = useState('');
  const [lostReason, setLostReason] = useState('Price Too High');
  const [showLostDialog, setShowLostDialog] = useState(false);

  if (!isOpen || !lead) return null;

  const handleStageChange = (newStage: LeadStage) => {
    if (newStage === 'lost') {
      setShowLostDialog(true);
      return;
    }
    StorageService.updateLeadStage(lead.id, newStage);
    success('Lead Stage Updated', `Moved to ${newStage.replace('_', ' ')}.`);
    if (onUpdated) onUpdated();
  };

  const handleConfirmLost = () => {
    StorageService.updateLeadStage(lead.id, 'lost', lostReason);
    setShowLostDialog(false);
    success('Lead Marked as Lost', `Reason: ${lostReason}`);
    if (onUpdated) onUpdated();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    StorageService.addLeadNote(lead.id, newNote.trim(), 'Current Staff');
    setNewNote('');
    success('Note Added', 'Internal note recorded in lead history.');
    if (onUpdated) onUpdated();
  };

  const handleCall = () => {
    window.location.href = `tel:${lead.customerPhone}`;
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent(
      `Hello ${lead.customerName}, following up regarding your enquiry on ${lead.interestedVehicleTitle}.`
    );
    window.open(`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="p-6 bg-[#10151F] text-white flex items-center justify-between border-b border-[#233044]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#182231] border border-[#C6F36B]/40 flex items-center justify-center font-bold text-[#C6F36B]">
              {lead.customerName[0]}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">{lead.customerName}</h3>
              <p className="text-xs text-slate-400">
                Source: <span className="text-[#54D7E8] font-semibold">{lead.source}</span> • Enquired {timeAgo(lead.enquiryDate)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700">
          {/* Stage Switcher */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">Current Pipeline Stage</label>
            <select
              value={lead.stage}
              onChange={(e) => handleStageChange(e.target.value as LeadStage)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-900 focus:outline-none"
            >
              {STAGES.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Lost Dialog Confirmation */}
          {showLostDialog && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <h5 className="font-bold text-red-900">Mark Lead as Lost</h5>
              <select
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
                className="w-full bg-white border border-red-300 rounded-lg p-2 text-xs"
              >
                <option value="Price Too High">Price Too High</option>
                <option value="Bought Another Car">Bought Another Car</option>
                <option value="No Longer Interested">No Longer Interested</option>
                <option value="Finance / Loan Rejected">Finance / Loan Rejected</option>
                <option value="Vehicle Already Sold">Vehicle Already Sold</option>
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirmLost}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg"
                >
                  Confirm Lost
                </button>
                <button
                  type="button"
                  onClick={() => setShowLostDialog(false)}
                  className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Quick Action Contact Strip */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCall}
              className="py-2.5 px-3 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-[#C6F36B]" />
              <span>Call ({lead.customerPhone})</span>
            </button>
            <button
              onClick={handleWhatsapp}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </button>
          </div>

          {/* Interested Vehicle Card */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400">
              Vehicle in Discussion
            </span>
            <div className="flex items-center gap-3">
              {lead.interestedVehicleImage && (
                <img
                  src={lead.interestedVehicleImage}
                  alt="Car"
                  className="w-16 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                />
              )}
              <div className="overflow-hidden">
                <h5 className="font-bold text-slate-900 truncate">{lead.interestedVehicleTitle}</h5>
                {lead.interestedVehiclePrice && (
                  <p className="font-extrabold text-[#10151F] mt-0.5">
                    Asking: {formatPriceINR(lead.interestedVehiclePrice)}
                  </p>
                )}
                {lead.customerBudget && (
                  <p className="text-[11px] text-slate-500">
                    Customer Budget: {formatPriceINR(lead.customerBudget)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Staff Assignment & Follow Up */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Assigned Sales Executive</span>
              <p className="font-bold text-slate-900 mt-0.5">{lead.assignedSalespersonName}</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 block font-semibold">Next Follow-up</span>
              <p className="font-bold text-blue-600 mt-0.5">
                {lead.nextFollowUpDate ? formatDate(lead.nextFollowUpDate) : 'None scheduled'}
              </p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-500" />
              <span>Internal Dealership Notes ({lead.notes.length})</span>
            </h4>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                placeholder="Log a call outcome or note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs"
              >
                Add
              </button>
            </form>

            <div className="space-y-2">
              {lead.notes.map((n) => (
                <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <p className="text-slate-800">{n.text}</p>
                  <p className="text-[10px] text-slate-400">
                    By {n.authorName} • {timeAgo(n.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>CRM Activity Timeline</span>
            </h4>
            <div className="space-y-2 border-l-2 border-slate-200 pl-3 ml-2">
              {lead.timeline.map((act) => (
                <div key={act.id} className="space-y-0.5 relative">
                  <span className="w-2 h-2 rounded-full bg-blue-500 absolute -left-[17px] top-1"></span>
                  <p className="font-bold text-xs text-slate-900">{act.title}</p>
                  <p className="text-[11px] text-slate-600">{act.description}</p>
                  <p className="text-[10px] text-slate-400">{timeAgo(act.timestamp)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 text-slate-800 font-bold text-xs hover:bg-slate-300"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
