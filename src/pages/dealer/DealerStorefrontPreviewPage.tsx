import React, { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import {
  Store,
  Sparkles,
  Smartphone,
  Monitor,
  Save,
  CheckCircle2,
  ExternalLink,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

const PRESET_THEMES = [
  { name: 'Futuristic Lime', primary: '#10151F', accent: '#C6F36B' },
  { name: 'Cyber Cyan', primary: '#0E1726', accent: '#54D7E8' },
  { name: 'Executive Gold', primary: '#171B26', accent: '#F59E0B' },
  { name: 'Emerald Trust', primary: '#0B132B', accent: '#10B981' },
  { name: 'Royal Slate', primary: '#0F172A', accent: '#38BDF8' },
];

export const DealerStorefrontPreviewPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Customization fields
  const [welcomeMessage, setWelcomeMessage] = useState(
    dealer.theme.customWelcomeMessage || `Welcome to ${dealer.name}`
  );
  const [accentColor, setAccentColor] = useState(dealer.theme.accentColor || '#C6F36B');
  const [logoUrl, setLogoUrl] = useState(dealer.logo);
  const [coverUrl, setCoverUrl] = useState(dealer.coverImage);

  const handleSaveTheme = () => {
    dealer.theme.customWelcomeMessage = welcomeMessage;
    dealer.theme.accentColor = accentColor;
    dealer.logo = logoUrl;
    dealer.coverImage = coverUrl;

    StorageService.saveDealer(dealer);
    success('Branding Updated!', 'Your live showroom design has been published.');
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Branded Showroom Customisation & Live Preview"
        subtitle={`Design your personal dealership website storefront on ${dealer.customDomain}`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Branding Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  <span>Showroom Brand Styling</span>
                </h3>
              </div>

              {/* Welcome Message */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hero Welcome Headline
                </label>
                <textarea
                  rows={2}
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white"
                ></textarea>
              </div>

              {/* Accent Color Palette */}
              <div>
                <label className="block font-bold text-slate-700 mb-2">Accent Color Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_THEMES.map((theme) => (
                    <button
                      key={theme.name}
                      type="button"
                      onClick={() => setAccentColor(theme.accent)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        accentColor === theme.accent
                          ? 'border-slate-900 ring-2 ring-blue-500 shadow'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      title={theme.name}
                    >
                      <span
                        className="w-5 h-5 rounded-full shadow-inner"
                        style={{ backgroundColor: theme.accent }}
                      ></span>
                      <span className="text-[9px] font-bold text-slate-700 truncate w-full text-center">
                        {theme.name.split(' ')[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Logo URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dealer Logo URL</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Showroom Hero Banner Image</label>
                <input
                  type="text"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveTheme}
                  className="w-full py-3 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Publish Custom Theme</span>
                </button>
              </div>
            </div>

            {/* Quick Live Link */}
            <div className="p-4 rounded-2xl bg-slate-100 text-xs text-slate-700 flex items-center justify-between">
              <div>
                <p className="font-bold">Public Showroom URL</p>
                <p className="font-mono text-slate-500 text-[11px] truncate">https://{dealer.customDomain}</p>
              </div>
              <Link
                to={`/showroom/${dealer.slug}`}
                target="_blank"
                className="p-2 rounded-xl bg-white shadow-sm text-slate-900 hover:text-blue-600"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Live Interactive Device Frame */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Live Storefront Sandbox</span>
              <div className="flex items-center gap-1 bg-slate-200 p-1 rounded-xl">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    previewDevice === 'desktop' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                    previewDevice === 'mobile' ? 'bg-white shadow text-slate-900' : 'text-slate-600'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>
            </div>

            {/* Simulated Live Browser Viewport */}
            <div
              className={`mx-auto bg-white rounded-3xl border-4 border-slate-900 shadow-2xl overflow-hidden transition-all duration-300 ${
                previewDevice === 'desktop' ? 'w-full' : 'max-w-sm'
              }`}
            >
              {/* Browser chrome */}
              <div className="bg-[#10151F] text-slate-400 px-4 py-2 flex items-center gap-3 border-b border-[#233044] text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                </div>
                <div className="bg-[#182231] rounded-lg px-3 py-1 flex-1 text-center font-mono text-white text-[10px] truncate">
                  https://{dealer.customDomain}
                </div>
              </div>

              {/* Mini Showroom Header */}
              <div className="bg-[#10151F] text-white p-4 flex items-center justify-between border-b border-[#233044]">
                <div className="flex items-center gap-2">
                  <img src={logoUrl} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-extrabold text-xs text-white leading-tight">{dealer.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dealer.contact.city}
                    </span>
                  </div>
                </div>
                <span
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-[#10151F]"
                  style={{ backgroundColor: accentColor }}
                >
                  Contact Desk
                </span>
              </div>

              {/* Mini Hero */}
              <div className="relative h-44 bg-slate-950 overflow-hidden text-white p-6 flex flex-col justify-end">
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="w-full h-full object-cover absolute inset-0 opacity-30"
                />
                <div className="relative z-10 space-y-1">
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider"
                    style={{ color: accentColor }}
                  >
                    Premier Dealership
                  </span>
                  <h3 className="text-base sm:text-lg font-black leading-snug">{welcomeMessage}</h3>
                  <p className="text-[10px] text-slate-300">
                    {dealer.activeListingsCount} Certified Pre-Owned Vehicles Available
                  </p>
                </div>
              </div>

              {/* Sample Mini Cards */}
              <div className="p-4 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Featured Lot Inventory</span>
                  <span className="text-[10px] text-blue-600">View All</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400"
                        alt="Car"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-[11px] text-slate-900 truncate">Hyundai Creta SX</p>
                    <p className="text-[10px] font-extrabold text-[#10151F]">₹15.40 Lakh</p>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1">
                    <div className="aspect-video bg-slate-200 rounded-lg overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400"
                        alt="Car"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="font-bold text-[11px] text-slate-900 truncate">Mahindra Thar 4x4</p>
                    <p className="text-[10px] font-extrabold text-[#10151F]">₹16.90 Lakh</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
