import React, { useState } from 'react';
import { Vehicle } from '@/types/vehicle';
import { StorageService } from '@/services/storage';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { formatPriceINR } from '@/utils/formatters';
import {
  MessageSquare,
  Phone,
  User,
  X,
  CheckCircle2,
  Send,
  MessageCircle,
} from 'lucide-react';

interface EnquiryModalProps {
  vehicle: Vehicle;
  isOpen: boolean;
  onClose: () => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  const { currentUser } = useAuth();
  const { success } = useToast();

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [message, setMessage] = useState(
    `Hi, I am interested in this ${vehicle.make} ${vehicle.model}. Is the price negotiable? When can I see the car?`
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone');
      return;
    }

    const leadId = 'lead-' + Date.now();
    StorageService.saveLead({
      id: leadId,
      dealerId: vehicle.dealerId,
      customerName: name,
      customerPhone: phone,
      customerCity: vehicle.dealerCity,
      interestedVehicleId: vehicle.id,
      interestedVehicleTitle: `${vehicle.make} ${vehicle.model} (${vehicle.variant})`,
      interestedVehicleImage: vehicle.primaryImage,
      interestedVehiclePrice: vehicle.pricing.askingPrice,
      customerBudget: vehicle.pricing.askingPrice,
      source: 'Antilog marketplace',
      stage: 'new',
      assignedSalespersonName: 'Unassigned',
      nextFollowUpDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      nextFollowUpNote: 'New callback enquiry from website',
      notes: [
        {
          id: 'note-' + Date.now(),
          text: `Customer enquiry: "${message}"`,
          createdAt: new Date().toISOString(),
          authorName: 'Marketplace Form',
        },
      ],
      timeline: [
        {
          id: 'act-' + Date.now(),
          type: 'system',
          title: 'Enquiry Received',
          description: `Message: "${message}"`,
          timestamp: new Date().toISOString(),
          authorName: name,
        },
      ],
      enquiryDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setIsSubmitted(true);
    success(
      'Enquiry Sent!',
      `${vehicle.dealerName} has received your enquiry and will contact you shortly.`
    );
  };

  const handleWhatsappNow = () => {
    const text = encodeURIComponent(
      `Hello ${vehicle.dealerName}, I am interested in ${vehicle.make} ${vehicle.model} (${vehicle.variant}) listed for ${formatPriceINR(vehicle.pricing.askingPrice)} on Antilog.\n${message}`
    );
    window.open(`https://wa.me/${vehicle.dealerWhatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="bg-[#10151F] text-white p-5 flex items-center justify-between border-b border-[#233044]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#182231] border border-[#54D7E8]/40 flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[#54D7E8]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Contact Dealership</h3>
              <p className="text-xs text-slate-400">{vehicle.dealerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Enquiry Submitted!</h4>
            <p className="text-sm text-slate-600">
              The sales team at <span className="font-semibold text-slate-900">{vehicle.dealerName}</span> has received your details and will call you on <span className="font-semibold text-slate-900">{phone}</span> within 1 business hour.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleWhatsappNow}
                className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Instantly on WhatsApp</span>
              </button>
              <button
                onClick={onClose}
                className="w-full py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Anand Mehra"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="+91 98XXX XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Message for Dealer</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                required
              ></textarea>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-[#54D7E8]" />
                <span>Send Enquiry / Request Callback</span>
              </button>
              <button
                type="button"
                onClick={handleWhatsappNow}
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Or Chat Directly via WhatsApp</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
