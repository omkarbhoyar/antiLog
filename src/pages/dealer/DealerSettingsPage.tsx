import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import {
  Settings,
  Building2,
  Phone,
  Globe,
  Bell,
  Shield,
  Download,
  Save,
  CheckCircle2,
} from 'lucide-react';

export const DealerSettingsPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [activeTab, setActiveTab] = useState<'profile' | 'domain' | 'notifications' | 'export'>('profile');

  // Profile form state
  const [name, setName] = useState(dealer.name);
  const [tagline, setTagline] = useState(dealer.tagline);
  const [phone, setPhone] = useState(dealer.contact.phone);
  const [whatsapp, setWhatsapp] = useState(dealer.contact.whatsapp);
  const [email, setEmail] = useState(dealer.contact.email);
  const [address, setAddress] = useState(dealer.contact.address);
  const [city, setCity] = useState(dealer.contact.city);
  const [about, setAbout] = useState(dealer.about);

  // Notification state
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappLeadNotification, setWhatsappLeadNotification] = useState(true);
  const [dailyDigest, setDailyDigest] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    dealer.name = name;
    dealer.tagline = tagline;
    dealer.contact.phone = phone;
    dealer.contact.whatsapp = whatsapp;
    dealer.contact.email = email;
    dealer.contact.address = address;
    dealer.contact.city = city;
    dealer.about = about;

    StorageService.saveDealer(dealer);
    success('Settings Updated', 'Dealership business profile saved.');
  };

  const handleExportAllData = () => {
    const data = {
      dealer,
      vehicles: StorageService.getVehicles().filter((v) => v.dealerId === dealer.id),
      leads: StorageService.getLeads(dealer.id),
      appointments: StorageService.getAppointments(dealer.id),
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dealer.slug}-complete-data-export.json`;
    a.click();
    success('Data Export Generated', 'Downloaded JSON backup of inventory and CRM.');
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Dealership Profile & Settings"
        subtitle={`Configure public branding, contact info, domains, and notification rules for ${dealer.name}`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeTab === 'profile' ? 'bg-[#10151F] text-[#C6F36B]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Business Profile
          </button>
          <button
            onClick={() => setActiveTab('domain')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeTab === 'domain' ? 'bg-[#10151F] text-[#C6F36B]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Custom Domain & DNS
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeTab === 'notifications' ? 'bg-[#10151F] text-[#C6F36B]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Notifications
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-2 rounded-xl transition-all ${
              activeTab === 'export' ? 'bg-[#10151F] text-[#C6F36B]' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Data Backup & Export
          </button>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dealership Business Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Business Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Physical Showroom Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Dealership Description</label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Business Profile</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Domain */}
        {activeTab === 'domain' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 mb-1">Connected Custom Domain</h4>
              <p className="text-slate-500">
                Your digital showroom website resolves automatically under this domain name
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Assigned Domain</span>
                <p className="font-mono text-base font-bold text-slate-900">{dealer.customDomain}</p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> SSL Certificate Active
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <h5 className="font-bold text-slate-800">DNS Configuration Records</h5>
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1">
                <p>CNAME @ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; showroom.antilog.com &nbsp;&nbsp; TTL 300</p>
                <p>A &nbsp;&nbsp;&nbsp;&nbsp; @ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 76.76.21.21 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; TTL 300</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 text-xs">
            <h4 className="font-extrabold text-sm text-slate-900 mb-4">Notification Preferences</h4>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Instant WhatsApp Lead Alert</span>
                  <span className="text-slate-500 text-[11px]">Receive a WhatsApp ping whenever a buyer submits an enquiry</span>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappLeadNotification}
                  onChange={(e) => setWhatsappLeadNotification(e.target.checked)}
                  className="accent-[#10151F] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">SMS Booking Confirmation</span>
                  <span className="text-slate-500 text-[11px]">Send automatic SMS to customer upon scheduling test drive</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="accent-[#10151F] w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <div>
                  <span className="font-bold text-slate-800 block">Morning Executive Daily Digest</span>
                  <span className="text-slate-500 text-[11px]">Receive 09:00 AM summary of pending follow-ups & test drives</span>
                </div>
                <input
                  type="checkbox"
                  checked={dailyDigest}
                  onChange={(e) => setDailyDigest(e.target.checked)}
                  className="accent-[#10151F] w-4 h-4"
                />
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Export */}
        {activeTab === 'export' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs">
            <h4 className="font-extrabold text-sm text-slate-900">Data Portability & Full Export</h4>
            <p className="text-slate-600 leading-relaxed">
              Export all customer leads, test drive logs, vehicle specifications, and audit records in JSON format for offline archive or legal compliance.
            </p>
            <button
              onClick={handleExportAllData}
              className="px-6 py-3 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-[#C6F36B]" />
              <span>Download Full Dealership Data Backup (.json)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
