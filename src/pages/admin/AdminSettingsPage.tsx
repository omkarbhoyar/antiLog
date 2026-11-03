import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useToast } from '@/context/ToastContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import {
  Settings,
  ShieldCheck,
  Globe,
  FileCode,
  CheckCircle2,
  Lock,
  Save,
  Clock,
} from 'lucide-react';

const AUDIT_LOGS = [
  { id: 'log-1', action: 'Approved Dealership Verification', entity: 'OM Cars (Nagpur)', user: 'admin@antilog.com', time: '10 mins ago' },
  { id: 'log-2', action: 'Listing Moderated (Approved)', entity: 'Hyundai Creta 1.4 Turbo', user: 'admin@antilog.com', time: '25 mins ago' },
  { id: 'log-3', action: 'Subscription Renewal Processed', entity: 'Jay Cars (Professional Tier)', user: 'System Autopay', time: '2 hours ago' },
  { id: 'log-4', action: 'New Showroom Domain Provisioned', entity: 'mansicars.com -> SSL Ready', user: 'DNS Bot', time: '5 hours ago' },
  { id: 'log-5', action: 'Customer Requirement Dispatched', entity: 'Nagpur Region (3 matched)', user: 'Auto-Match Engine', time: '1 day ago' },
];

export const AdminSettingsPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { success } = useToast();

  const [platformName, setPlatformName] = useState('Antilog');
  const [supportEmail, setSupportEmail] = useState('operations@antilog.com');
  const [supportPhone, setSupportPhone] = useState('+91 80000 12345');
  const [rootDomain, setRootDomain] = useState('antilog.com');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Platform Config Saved', 'Global branding and domain routing updated.');
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Antilog SaaS Global Settings & Audit Trail"
        subtitle="Manage root domain routing, enterprise platform configuration, and administrative audit logs"
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Settings Form */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Platform Branding & Central Domains</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product Brand Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Central Marketplace Domain</label>
              <input
                type="text"
                value={rootDomain}
                onChange={(e) => setRootDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Central Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dealer Toll-Free Hotline</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900"
                required
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Central Configuration</span>
            </button>
          </div>
        </form>

        {/* Audit Log Trail */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>System Security & Operational Audit Log</span>
            </h3>
            <span className="text-[11px] text-slate-400">Immutable Ledger</span>
          </div>

          <div className="space-y-3">
            {AUDIT_LOGS.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-slate-900">{log.action}</p>
                  <p className="text-[11px] text-slate-500">
                    Entity: <strong>{log.entity}</strong> • Operator: {log.user}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
