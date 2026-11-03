import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { formatPriceINR } from '@/utils/formatters';
import {
  Building2,
  Car,
  CreditCard,
  Users,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MRR_GROWTH_DATA = [
  { month: 'May', mrr: 45000, dealers: 2 },
  { month: 'Jun', mrr: 72000, dealers: 3 },
  { month: 'Jul', mrr: 98000, dealers: 4 },
  { month: 'Aug', mrr: 115000, dealers: 4 },
  { month: 'Sep', mrr: 132000, dealers: 5 },
  { month: 'Oct', mrr: 148700, dealers: 5 },
];

export const AdminDashboardPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();

  const dealers = StorageService.getDealers();
  const vehicles = StorageService.getVehicles();
  const requirements = StorageService.getRequirements();

  const verifiedDealers = dealers.filter((d) => d.verificationStatus === 'verified');
  const pendingDealers = dealers.filter((d) => d.verificationStatus === 'pending');
  const pendingVehicles = vehicles.filter((v) => v.moderationStatus === 'pending');

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="Antilog SaaS Central Command"
        subtitle="Platform-wide operational intelligence, dealership network health, and MRR metrics"
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Urgent Action Alert if Pending Verification */}
        {pendingDealers.length > 0 && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4 text-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-500 shrink-0" />
              <span className="text-amber-900 font-bold">
                {pendingDealers.length} Dealership Verification Request Pending Review: {pendingDealers.map((d) => d.name).join(', ')}
              </span>
            </div>
            <Link
              to="/admin/dealers"
              className="px-3 py-1.5 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold shrink-0 hover:bg-[#182231]"
            >
              Review Verification
            </Link>
          </div>
        )}

        {/* Platform KPI Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Registered Dealerships</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{dealers.length}</span>
              <span className="text-xs text-emerald-600 font-bold">{verifiedDealers.length} Verified</span>
            </div>
            <p className="text-[11px] text-slate-500">Across 5 Tier-1 & Tier-2 cities</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Platform Vehicle Inventory</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{vehicles.length}</span>
              <span className="text-xs text-blue-600 font-bold">Active Listings</span>
            </div>
            <p className="text-[11px] text-slate-500">{pendingVehicles.length} pending moderation</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Monthly Recurring Revenue</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">₹1.48L</span>
              <span className="text-xs text-emerald-600 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +12.6%
              </span>
            </div>
            <p className="text-[11px] text-slate-500">From 5 active dealer SaaS subscriptions</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase">Customer Requirements</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{requirements.length}</span>
              <span className="text-xs text-purple-600 font-bold">Broadcasted</span>
            </div>
            <p className="text-[11px] text-slate-500">Matched with dealer inventories</p>
          </div>
        </div>

        {/* Central MRR & Dealer Onboarding Chart */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                SaaS Revenue & Dealership Network Trajectory (MRR ₹)
              </h3>
              <p className="text-xs text-slate-500">Software subscription billing collected by Antilog</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MRR_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#54D7E8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#54D7E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  stroke="#54D7E8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorMrr)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Review Split: Dealerships vs Moderation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dealerships Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Registered Dealerships</h3>
              <Link to="/admin/dealers" className="text-xs font-bold text-blue-600 hover:underline">
                Manage All →
              </Link>
            </div>

            <div className="space-y-3">
              {dealers.map((d) => (
                <div
                  key={d.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={d.logo} alt={d.name} className="w-9 h-9 rounded-lg object-cover" />
                    <div>
                      <h5 className="font-bold text-slate-900">{d.name}</h5>
                      <p className="text-[11px] text-slate-500">
                        {d.contact.city} • Plan: <span className="font-bold uppercase text-slate-800">{d.subscriptionPlan}</span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                      d.verificationStatus === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {d.verificationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Vehicle Moderations */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Listing Moderation Queue</h3>
              <Link to="/admin/listings" className="text-xs font-bold text-blue-600 hover:underline">
                Open Queue →
              </Link>
            </div>

            <div className="space-y-3">
              {vehicles.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={v.primaryImage}
                      alt={v.model}
                      className="w-12 h-9 rounded-lg object-cover"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 truncate">
                        {v.manufacturingYear} {v.make} {v.model}
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Dealer: {v.dealerName} ({v.dealerCity})
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {v.moderationStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
