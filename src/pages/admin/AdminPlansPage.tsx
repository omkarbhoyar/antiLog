import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { SubscriptionPlan, PlanTier } from '@/types/subscription';
import { formatPriceINR } from '@/utils/formatters';
import {
  CreditCard,
  Edit,
  CheckCircle2,
  Users,
  Car,
  Layers,
  X,
  Save,
} from 'lucide-react';

export const AdminPlansPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { success } = useToast();

  const [plans, setPlans] = useState(() => StorageService.getPlans());
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);

  // Form states
  const [price, setPrice] = useState(0);
  const [vehicleLimit, setVehicleLimit] = useState(0);
  const [userLimit, setUserLimit] = useState(0);

  const dealers = StorageService.getDealers();

  const handleStartEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setPrice(plan.monthlyPrice);
    setVehicleLimit(plan.vehicleLimit);
    setUserLimit(plan.userLimit);
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    const updated: SubscriptionPlan = {
      ...editingPlan,
      monthlyPrice: price,
      vehicleLimit,
      userLimit,
    };

    StorageService.savePlan(updated);
    setPlans(StorageService.getPlans());
    setEditingPlan(null);
    success('Plan Configuration Saved', `Updated parameters for ${updated.name}.`);
  };

  return (
    <div className="flex-1 pb-16">
      <AdminHeader
        title="SaaS Subscription Plan Management"
        subtitle="Manage dealership pricing tiers, vehicle capacity thresholds, and team seat limits"
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Edit Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-sm text-slate-900">
                Configure {editingPlan.name} Plan
              </h3>
              <button onClick={() => setEditingPlan(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Price (₹)</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Max Vehicle Capacity Limit</label>
                <input
                  type="number"
                  value={vehicleLimit}
                  onChange={(e) => setVehicleLimit(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Staff User Seats Limit</label>
                <input
                  type="number"
                  value={userLimit}
                  onChange={(e) => setUserLimit(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                  required
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Plan Parameters</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const subscribers = dealers.filter((d) => d.subscriptionPlan === p.id);
            return (
              <div
                key={p.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-base text-slate-900">{p.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {subscribers.length} Subscribers
                    </span>
                  </div>

                  <p className="text-2xl font-black text-slate-900">
                    {p.id === 'enterprise' ? 'Custom' : `${formatPriceINR(p.monthlyPrice)}`}
                    {p.id !== 'enterprise' && (
                      <span className="text-xs text-slate-500 font-normal"> / mo</span>
                    )}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Max Cars:</span>
                      <strong>{p.vehicleLimit}</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">User Seats:</span>
                      <strong>{p.userLimit} Users</strong>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleStartEdit(p)}
                  className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Configure Limits</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
