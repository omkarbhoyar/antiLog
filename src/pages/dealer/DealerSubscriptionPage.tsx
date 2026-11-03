import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { DealerHeader } from '@/components/dealer/DealerHeader';
import { PlanTier } from '@/types/subscription';
import { formatPriceINR, formatDate } from '@/utils/formatters';
import {
  CreditCard,
  CheckCircle2,
  Sparkles,
  Download,
  AlertTriangle,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  X,
} from 'lucide-react';

export const DealerSubscriptionPage: React.FC = () => {
  const { toggleMobileMenu } = useOutletContext<{ toggleMobileMenu: () => void }>();
  const { currentUser } = useAuth();
  const { success, info } = useToast();

  const dealerId = currentUser.dealerId || 'dealer-1';
  const dealer = StorageService.getDealerById(dealerId) || StorageService.getDealers()[0];

  const plans = StorageService.getPlans();
  const invoices = StorageService.getInvoices();

  const [currentPlanTier, setCurrentPlanTier] = useState<PlanTier>(dealer.subscriptionPlan);
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<PlanTier | null>(null);

  const currentPlan = plans.find((p) => p.id === currentPlanTier) || plans[2];
  const activeVehiclesCount = dealer.activeListingsCount;
  const vehicleLimit = currentPlan.vehicleLimit;
  const percentUsed = Math.min(100, Math.round((activeVehiclesCount / vehicleLimit) * 100));

  const handleConfirmUpgrade = () => {
    if (!selectedPlanForUpgrade) return;
    setCurrentPlanTier(selectedPlanForUpgrade);
    dealer.subscriptionPlan = selectedPlanForUpgrade;
    StorageService.saveDealer(dealer);
    setSelectedPlanForUpgrade(null);
    success(
      'Plan Upgraded Successfully!',
      `Your dealership is now active on the ${selectedPlanForUpgrade.toUpperCase()} tier.`
    );
  };

  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your Antilog OS subscription? Your listings will stay online until the end of your billing cycle.')) {
      info('Subscription Cancellation Requested', 'Our support team has logged your cancellation.');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <DealerHeader
        title="Subscription & Billing Operations"
        subtitle={`Manage your Antilog SaaS tier, billing invoices, and vehicle listing limits`}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Upgrade Confirmation Modal (Simulated Mock Payment) */}
      {selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C6F36B] bg-[#10151F] rounded p-0.5" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Switch to {selectedPlanForUpgrade.toUpperCase()} Plan
                </h3>
              </div>
              <button onClick={() => setSelectedPlanForUpgrade(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                Mock Payment Demo
              </span>
              <p className="text-slate-700 leading-relaxed">
                This is a simulated SaaS subscription checkout. No real money will be charged to your card.
              </p>
              <div className="pt-2 flex items-center justify-between font-bold text-slate-900 border-t border-slate-200">
                <span>Monthly Recurring Total:</span>
                <span className="text-base text-blue-600">
                  {formatPriceINR(
                    plans.find((p) => p.id === selectedPlanForUpgrade)?.monthlyPrice || 0
                  )}/mo
                </span>
              </div>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleConfirmUpgrade}
                className="flex-1 py-3 rounded-xl bg-[#10151F] text-[#C6F36B] font-bold text-xs hover:bg-[#182231] transition-all"
              >
                Confirm Plan Switch
              </button>
              <button
                onClick={() => setSelectedPlanForUpgrade(null)}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-8">
        {/* Current Plan Overview Card */}
        <div className="bg-gradient-to-r from-[#10151F] via-[#182231] to-[#10151F] rounded-3xl p-6 sm:p-8 text-white border border-[#233044] shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#C6F36B]/10 text-[#C6F36B] border border-[#C6F36B]/30 uppercase tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" /> Active SaaS Subscription
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentPlan.name} Plan
              </h2>
              <p className="text-xs text-slate-300">{currentPlan.tagline}</p>
            </div>

            {/* Vehicle Limit Usage Meter */}
            <div className="p-4 rounded-2xl bg-[#0B0F17]/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Active Vehicle Capacity</span>
                <span className="font-mono font-bold text-white">
                  {activeVehiclesCount} / {vehicleLimit} Cars
                </span>
              </div>

              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full bg-gradient-to-r from-[#C6F36B] to-[#54D7E8] transition-all"
                  style={{ width: `${percentUsed}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-400 text-right">{percentUsed}% of lot limit utilized</p>
            </div>

            {/* Pricing & Renewal */}
            <div className="flex flex-col md:items-end justify-center space-y-2">
              <span className="text-2xl font-black text-white">
                {formatPriceINR(currentPlan.monthlyPrice)}
                <span className="text-xs text-slate-400 font-normal"> / month</span>
              </span>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#54D7E8]" />
                <span>Next Renewal: {formatDate(dealer.subscriptionRenewalDate)}</span>
              </p>
              <button
                onClick={handleCancelSubscription}
                className="text-[11px] text-red-400 hover:text-red-300 underline pt-1"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>

        {/* Plan Comparison Grid */}
        <div className="space-y-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Antilog Dealership Subscription Plans
            </h3>
            <p className="text-xs text-slate-500">
              Scale your digital showroom capacity as your dealership inventory grows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p) => {
              const isCurrent = p.id === currentPlanTier;
              return (
                <div
                  key={p.id}
                  className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between space-y-6 ${
                    isCurrent
                      ? 'border-[#10151F] ring-2 ring-[#C6F36B] shadow-lg'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-extrabold text-base text-slate-900">{p.name}</h4>
                      {isCurrent && (
                        <span className="bg-[#10151F] text-[#C6F36B] text-[10px] font-bold px-2 py-0.5 rounded">
                          CURRENT
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-2xl font-black text-slate-900">
                        {p.id === 'enterprise' ? 'Custom' : `${formatPriceINR(p.monthlyPrice)}`}
                      </span>
                      {p.id !== 'enterprise' && (
                        <span className="text-xs text-slate-500"> / month</span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                      {p.tagline}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700 text-[11px]">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    {isCurrent ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs cursor-default"
                      >
                        Active Tier
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedPlanForUpgrade(p.id)}
                        className="w-full py-2.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-bold text-xs transition-colors shadow-sm"
                      >
                        Switch to {p.name}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice & Billing History Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Billing History & GST Invoices</h3>
              <p className="text-xs text-slate-500">Download monthly tax invoices for input credit (ITC)</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Plan</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Payment Status</th>
                  <th className="py-3 pr-4 pl-2 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3">{formatDate(inv.date)}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{inv.planName}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {formatPriceINR(inv.amount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-4 pl-2 text-right">
                      <button
                        onClick={() => success('Invoice Downloaded', `Saved ${inv.invoiceNumber}.pdf`)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
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
