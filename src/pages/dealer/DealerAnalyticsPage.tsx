import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { formatPriceINR } from '@/utils/formatters';
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Users2,
  Clock,
  Car,
  Award,
  ChevronDown,
  Filter,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const AGEING_DATA = [
  { bucket: '< 15 Days', count: 8, fill: '#10B981' },
  { bucket: '15-30 Days', count: 5, fill: '#3B82F6' },
  { bucket: '30-60 Days', count: 3, fill: '#F59E0B' },
  { bucket: '60+ Days (Aged)', count: 1, fill: '#EF4444' },
];

const SALES_TREND = [
  { month: 'Jun', units: 8, revenueLakhs: 92 },
  { month: 'Jul', units: 11, revenueLakhs: 125 },
  { month: 'Aug', units: 14, revenueLakhs: 148 },
  { month: 'Sep', units: 12, revenueLakhs: 135 },
  { month: 'Oct', units: 18, revenueLakhs: 198 },
  { month: 'Nov (Proj)', units: 22, revenueLakhs: 240 },
];

export const DealerAnalyticsPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const vehicles = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);
  const team = StorageService.getTeam(dealer.id);

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Dealership Business Analytics"
        subtitle={`Sales metrics, stock ageing, lead conversion, and staff KPIs for ${dealer.name}`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Date Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Date Range:</span>
            {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                  dateRange === range
                    ? 'bg-[#10151F] text-[#C6F36B]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Reporting: FY 2026-27 Q3
          </span>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Avg Lot Turnaround</span>
            <p className="text-2xl font-black text-slate-900 mt-1">21 Days</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Fast moving stock</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lead-to-Sale Conversion</span>
            <p className="text-2xl font-black text-slate-900 mt-1">19.2%</p>
            <span className="text-[11px] text-emerald-600 font-semibold">+3.4% above avg</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Car Views</span>
            <p className="text-2xl font-black text-slate-900 mt-1">18,420</p>
            <span className="text-[11px] text-blue-600 font-semibold">Across showroom & marketplace</span>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Test Drive Booking Rate</span>
            <p className="text-2xl font-black text-slate-900 mt-1">34.8%</p>
            <span className="text-[11px] text-purple-600 font-semibold">High intent inquiries</span>
          </div>
        </div>

        {/* Charts: Sales Trend & Inventory Ageing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Units Delivered */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Vehicle Sales & Revenue Trajectory (₹ Lakhs)
                </h3>
                <p className="text-xs text-slate-500">Gross sales volume generated</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_TREND}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="revenueLakhs" fill="#10151F" radius={[6, 6, 0, 0]} />
                  <Line dataKey="units" stroke="#C6F36B" strokeWidth={3} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Inventory Ageing Distribution */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Inventory Ageing</h3>
              <p className="text-xs text-slate-500 mb-4">Stock duration on dealer lot</p>

              <div className="space-y-3 pt-2">
                {AGEING_DATA.map((item) => (
                  <div key={item.bucket} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{item.bucket}</span>
                      <span className="font-bold text-slate-900">{item.count} cars</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${(item.count / 17) * 100}%`,
                          backgroundColor: item.fill,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 mt-4">
              <span className="font-bold">Healthy Stock Health:</span> 76% of current lot vehicles are under 30 days old.
            </div>
          </div>
        </div>

        {/* Staff Sales Performance Leaderboard */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Sales Team Performance Leaderboard</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Sales Executive</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Assigned Leads</th>
                  <th className="py-3 px-3">Deals Closed</th>
                  <th className="py-3 px-3">Conversion Rate</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {team.map((member) => {
                  const rate = member.leadsCount > 0 ? ((member.salesCount / member.leadsCount) * 100).toFixed(1) : '—';
                  return (
                    <tr key={member.id} className="hover:bg-slate-50">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{member.name}</p>
                            <p className="text-[10px] text-slate-400">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">{member.role}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{member.leadsCount}</td>
                      <td className="py-3.5 px-3 font-bold text-emerald-600">{member.salesCount}</td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">{rate}%</td>
                      <td className="py-3.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {member.status}
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
