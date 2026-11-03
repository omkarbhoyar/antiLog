import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { formatPriceINR, formatKilometers, formatDate, timeAgo } from '@/utils/formatters';
import {
  Car,
  Users2,
  Calendar,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageCircle,
  Eye,
  Plus,
  Flame,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const MONTHLY_ENQUIRIES_DATA = [
  { month: 'May', enquiries: 42, sales: 8 },
  { month: 'Jun', enquiries: 58, sales: 11 },
  { month: 'Jul', enquiries: 74, sales: 14 },
  { month: 'Aug', enquiries: 65, sales: 12 },
  { month: 'Sep', enquiries: 92, sales: 18 },
  { month: 'Oct', enquiries: 115, sales: 22 },
];

const LEAD_SOURCE_DATA = [
  { name: 'Marketplace', count: 48, fill: '#C6F36B' },
  { name: 'Storefront', count: 32, fill: '#54D7E8' },
  { name: 'WhatsApp', count: 28, fill: '#10B981' },
  { name: 'Walk-in', count: 18, fill: '#F59E0B' },
  { name: 'CarDekho', count: 12, fill: '#EC4899' },
];

const BRAND_DIST_DATA = [
  { name: 'Hyundai', count: 6, fill: '#3B82F6' },
  { name: 'Mahindra', count: 4, fill: '#EF4444' },
  { name: 'Maruti', count: 4, fill: '#10B981' },
  { name: 'Toyota', count: 3, fill: '#F59E0B' },
  { name: 'Tata', count: 3, fill: '#8B5CF6' },
];

export const DealerDashboardPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const vehicles = StorageService.getVehicles().filter((v) => v.dealerId === dealer.id);
  const leads = StorageService.getLeads(dealer.id);
  const appointments = StorageService.getAppointments(dealer.id);

  const availableCars = vehicles.filter((v) => v.status === 'available');
  const soldCars = vehicles.filter((v) => v.status === 'sold');
  const newLeads = leads.filter((l) => l.stage === 'new');
  const pendingAppointments = appointments.filter((a) => a.status === 'Requested' || a.status === 'Confirmed');

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title={`${dealer.name} Operating Console`}
        subtitle={`Live overview of inventory, sales leads, appointments, and showroom metrics`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* KPI CARDS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* 1. Active Inventory */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Active Inventory
              </span>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Car className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#182230]">{availableCars.length}</span>
              <span className="text-xs text-slate-400 font-medium">/ {vehicles.length} Total</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+3 added this week</span>
            </div>
          </div>

          {/* 2. Monthly Enquiries */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Total Leads (CRM)
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Users2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#182230]">{leads.length}</span>
              <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                {newLeads.length} New
              </span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>5 pending callbacks</span>
            </div>
          </div>

          {/* 3. Upcoming Test Drives */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Test Drives / Visits
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#182230]">{pendingAppointments.length}</span>
              <span className="text-xs text-slate-400 font-medium">Scheduled</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
              <span>Next drive today at 03:00 PM</span>
            </div>
          </div>

          {/* 4. Monthly Vehicle Turnover */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Monthly Vehicle Sales
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#182230]">₹1.42 Cr</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18% vs last month</span>
            </div>
          </div>
        </div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart: Monthly Enquiries & Sales */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Enquiries & Sales Growth Trend
                </h3>
                <p className="text-xs text-slate-500">Monthly breakdown of leads converted to sales</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-blue-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Enquiries
                </span>
                <span className="flex items-center gap-1.5 text-[#10151F]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10151F]"></span> Deliveries
                </span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_ENQUIRIES_DATA}>
                  <defs>
                    <linearGradient id="colorEnquiries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="enquiries"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorEnquiries)"
                  />
                  <Line type="monotone" dataKey="sales" stroke="#10151F" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Chart: Enquiries by Source */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Lead Acquisition Sources</h3>
              <p className="text-xs text-slate-500 mb-4">Where customer enquiries originated</p>

              <div className="h-44 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={LEAD_SOURCE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {LEAD_SOURCE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-slate-800">138</span>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Total</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100">
              {LEAD_SOURCE_DATA.map((s) => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.fill }}></span>
                  <span className="text-slate-600 truncate">{s.name}</span>
                  <span className="font-bold text-slate-800 ml-auto">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RECENT ACTIVITY & UPCOMING APPOINTMENTS SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Leads Activity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Recent CRM Leads</h3>
                <p className="text-xs text-slate-500">Prospects currently in negotiation or active</p>
              </div>
              <Link
                to="/dealer/leads"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Pipeline View</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {leads.slice(0, 5).map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{lead.customerName}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {lead.stage.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5">
                      Interested in: <strong>{lead.interestedVehicleTitle}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Assigned: {lead.assignedSalespersonName} • {timeAgo(lead.enquiryDate)}
                    </p>
                  </div>

                  <Link
                    to={`/dealer/leads?selected=${lead.id}`}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 shrink-0"
                    title="Open Lead"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Test Drives & Showroom Appointments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Upcoming Appointments ({pendingAppointments.length})
                </h3>
                <p className="text-xs text-slate-500">Scheduled customer visits & test drives</p>
              </div>
              <Link
                to="/dealer/appointments"
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Calendar</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {appointments.slice(0, 5).map((apt) => (
                <div
                  key={apt.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex flex-col items-center justify-center font-extrabold text-[10px] shrink-0 border border-purple-200">
                      <span>{apt.date.split('-')[2]}</span>
                      <span className="uppercase text-[9px] -mt-1">Nov</span>
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {apt.customerName}
                        </span>
                        <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                          {apt.appointmentType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 truncate mt-0.5">
                        {apt.vehicleTitle}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Time: {apt.time} • Contact: {apt.customerPhone}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`tel:${apt.customerPhone}`}
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shrink-0"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LATEST INVENTORY QUICK ACCESS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Current Lot Inventory</h3>
              <p className="text-xs text-slate-500">Live vehicles on showroom floor</p>
            </div>
            <Link
              to="/dealer/inventory"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-[#C6F36B]" />
              <span>Manage & Add Cars</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableCars.slice(0, 4).map((car) => (
              <div
                key={car.id}
                className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all group bg-white"
              >
                <div className="relative aspect-[16/10] bg-slate-900">
                  <img src={car.primaryImage} alt={car.model} className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {formatKilometers(car.specs.kilometers)}
                  </span>
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {car.make} {car.model}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{car.variant}</p>
                  <p className="font-extrabold text-sm text-[#10151F] mt-1">
                    {formatPriceINR(car.pricing.askingPrice)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
