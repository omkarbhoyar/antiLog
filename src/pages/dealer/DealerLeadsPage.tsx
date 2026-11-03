import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { StorageService, subscribeToStore } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { LeadDetailDrawer } from '@/components/dealer/LeadDetailDrawer';
import { Lead, LeadStage, LeadSource } from '@/types/lead';
import { formatPriceINR, timeAgo, formatDate } from '@/utils/formatters';
import {
  Users2,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Phone,
  MessageCircle,
  Clock,
  Car,
  ChevronRight,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';

const KANBAN_STAGES: { id: LeadStage; title: string; color: string }[] = [
  { id: 'new', title: 'New Leads', color: 'border-blue-400 bg-blue-50/40 text-blue-800' },
  { id: 'contacted', title: 'Contacted', color: 'border-slate-400 bg-slate-50 text-slate-800' },
  { id: 'interested', title: 'Interested', color: 'border-cyan-400 bg-cyan-50/40 text-cyan-800' },
  { id: 'visit_scheduled', title: 'Visit Scheduled', color: 'border-amber-400 bg-amber-50/40 text-amber-800' },
  { id: 'test_drive_scheduled', title: 'Test Drive Scheduled', color: 'border-purple-400 bg-purple-50/40 text-purple-800' },
  { id: 'negotiation', title: 'Negotiation', color: 'border-indigo-400 bg-indigo-50/40 text-indigo-800' },
  { id: 'converted', title: 'Converted 🎉', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
  { id: 'lost', title: 'Lost', color: 'border-red-400 bg-red-50 text-red-800' },
];

export const DealerLeadsPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success } = useToast();
  const [searchParams] = useSearchParams();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [leads, setLeads] = useState(() => StorageService.getLeads(dealer.id));
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);

  // Auto-open lead if URL param selected exists
  useEffect(() => {
    const selectedId = searchParams.get('selected');
    if (selectedId) {
      const found = StorageService.getLeadById(selectedId);
      if (found) setActiveLead(found);
    }
  }, [searchParams]);

  useEffect(() => {
    return subscribeToStore(() => {
      setLeads(StorageService.getLeads(dealer.id));
    });
  }, [dealer.id]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const match =
          lead.customerName.toLowerCase().includes(q) ||
          lead.customerPhone.includes(q) ||
          lead.interestedVehicleTitle.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedSource !== 'all' && lead.source !== selectedSource) return false;
      return true;
    });
  }, [leads, searchTerm, selectedSource]);

  // Quick new lead state
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newCarTitle, setNewCarTitle] = useState('');
  const [newSource, setNewSource] = useState<LeadSource>('Walk-in');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newLead: Lead = {
      id: 'lead-' + Date.now(),
      dealerId: dealer.id,
      customerName: newName,
      customerPhone: newPhone,
      customerCity: dealer.contact.city,
      interestedVehicleTitle: newCarTitle || 'Enquiring for vehicle',
      source: newSource,
      stage: 'new',
      assignedSalespersonName: currentUser.name,
      notes: [],
      timeline: [
        {
          id: 'act-' + Date.now(),
          type: 'system',
          title: 'Manual Lead Added',
          description: `Tagged via ${newSource}`,
          timestamp: new Date().toISOString(),
          authorName: currentUser.name,
        },
      ],
      enquiryDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.saveLead(newLead);
    setIsAddLeadModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewCarTitle('');
    success('Lead Created', `Added ${newLead.customerName} to the pipeline.`);
  };

  const handleMoveStage = (leadId: string, nextStage: LeadStage, e: React.MouseEvent) => {
    e.stopPropagation();
    StorageService.updateLeadStage(leadId, nextStage);
    success('Lead Moved', `Updated stage to ${nextStage.replace('_', ' ')}.`);
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Lead Management CRM"
        subtitle={`Sales pipeline tracking ${leads.length} prospects for ${dealer.name}`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <LeadDetailDrawer
        lead={activeLead}
        isOpen={!!activeLead}
        onClose={() => setActiveLead(null)}
        onUpdated={() => {
          if (activeLead) {
            const fresh = StorageService.getLeadById(activeLead.id);
            if (fresh) setActiveLead(fresh);
          }
        }}
      />

      {/* Manual Add Lead Modal */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-extrabold text-sm text-slate-900">Add New Customer Lead</h3>
              <button onClick={() => setIsAddLeadModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Anand Mehra"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98XXX XXXXX"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Interested Vehicle / Requirement</label>
                <input
                  type="text"
                  placeholder="e.g. Mahindra Thar 4x4 or Creta Diesel"
                  value={newCarTitle}
                  onChange={(e) => setNewCarTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Source Tag</label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value as LeadSource)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="Walk-in">Walk-in Showroom</option>
                  <option value="WhatsApp">WhatsApp Inquiry</option>
                  <option value="Phone call">Phone Call</option>
                  <option value="OLX">OLX Tag</option>
                  <option value="CarDekho">CarDekho Referral</option>
                  <option value="Instagram">Instagram Ad</option>
                  <option value="Antilog marketplace">Antilog Marketplace</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all"
              >
                Save & Open in Pipeline
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                placeholder="Search leads by customer, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Source filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="all">All Sources ({leads.length})</option>
              <option value="Antilog marketplace">Antilog Marketplace</option>
              <option value="Dealer website">Dealer Website</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Walk-in">Walk-in</option>
              <option value="CarDekho">CarDekho</option>
              <option value="OLX">OLX</option>
              <option value="Instagram">Instagram</option>
            </select>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'kanban' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-500'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table</span>
              </button>
            </div>

            <button
              onClick={() => setIsAddLeadModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C6F36B]" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* 1. KANBAN VIEW (8 Columns) */}
        {viewMode === 'kanban' && (
          <div className="overflow-x-auto pb-6">
            <div className="flex gap-4 min-w-[1500px]">
              {KANBAN_STAGES.map((col) => {
                const stageLeads = filteredLeads.filter((l) => l.stage === col.id);
                return (
                  <div
                    key={col.id}
                    className="w-72 bg-slate-100/70 rounded-2xl p-3 border border-slate-200/80 shrink-0 flex flex-col"
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-lg border ${col.color}`}>
                        {col.title}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {stageLeads.length}
                      </span>
                    </div>

                    {/* Column Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh] pr-1">
                      {stageLeads.length === 0 ? (
                        <div className="py-8 text-center text-[11px] text-slate-400">
                          No leads in this stage
                        </div>
                      ) : (
                        stageLeads.map((lead) => (
                          <div
                            key={lead.id}
                            onClick={() => setActiveLead(lead)}
                            className="bg-white rounded-xl p-3.5 border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md cursor-pointer transition-all space-y-2.5 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                                {lead.customerName}
                              </h4>
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {lead.source.split(' ')[0]}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 space-y-0.5">
                              <p className="font-semibold truncate">{lead.interestedVehicleTitle}</p>
                              {lead.customerBudget && (
                                <p className="text-[10px] text-slate-500">
                                  Budget: {formatPriceINR(lead.customerBudget)}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                              <span>Rep: {lead.assignedSalespersonName.split(' ')[0]}</span>
                              <span>{timeAgo(lead.enquiryDate)}</span>
                            </div>

                            {/* Quick Next Stage Mover */}
                            <div className="flex items-center justify-between pt-1">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${lead.customerPhone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-1 rounded bg-slate-100 text-slate-600 hover:text-blue-600"
                                >
                                  <Phone className="w-3 h-3" />
                                </a>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const text = encodeURIComponent(`Hi ${lead.customerName}, following up regarding your enquiry.`);
                                    window.open(`https://wa.me/${lead.customerPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                  }}
                                  className="p-1 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                >
                                  <MessageCircle className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveLead(lead);
                                }}
                                className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-0.5"
                              >
                                <span>Details</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-3">Vehicle of Interest</th>
                    <th className="py-3.5 px-3">Lead Source</th>
                    <th className="py-3.5 px-3">Current Stage</th>
                    <th className="py-3.5 px-3">Assigned Rep</th>
                    <th className="py-3.5 px-3">Follow-up</th>
                    <th className="py-3.5 pr-4 pl-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => setActiveLead(lead)}
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{lead.customerName}</p>
                        <p className="text-[11px] text-slate-500">{lead.customerPhone}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <p className="font-semibold text-slate-800 truncate max-w-xs">
                          {lead.interestedVehicleTitle}
                        </p>
                        {lead.customerBudget && (
                          <p className="text-[10px] text-slate-500">
                            Budget: {formatPriceINR(lead.customerBudget)}
                          </p>
                        )}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {lead.source}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-[11px] font-bold capitalize text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {lead.stage.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-slate-800">
                        {lead.assignedSalespersonName}
                      </td>
                      <td className="py-3.5 px-3 text-slate-500">
                        {lead.nextFollowUpDate ? formatDate(lead.nextFollowUpDate) : '—'}
                      </td>
                      <td className="py-3.5 pr-4 pl-2 text-right">
                        <button
                          onClick={() => setActiveLead(lead)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                        >
                          Open Lead
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
