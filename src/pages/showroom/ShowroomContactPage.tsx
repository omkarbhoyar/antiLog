import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '@/services/storage';
import { ShowroomNavbar } from '@/components/showroom/ShowroomNavbar';
import { ShowroomFooter } from '@/components/showroom/ShowroomFooter';
import { useToast } from '@/context/ToastContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  Send,
  Building2,
  ShieldCheck,
} from 'lucide-react';

export const ShowroomContactPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dealer = StorageService.getDealerBySlug(slug || '');
  const { success } = useToast();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!dealer) {
    return (
      <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Showroom Not Found</h2>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please enter your name and phone number');
      return;
    }

    const leadId = 'lead-' + Date.now();
    StorageService.saveLead({
      id: leadId,
      dealerId: dealer.id,
      customerName: name,
      customerPhone: phone,
      customerCity: dealer.contact.city,
      interestedVehicleTitle: 'General Showroom Enquiry',
      source: 'Dealer website',
      stage: 'new',
      assignedSalespersonName: 'Showroom Manager',
      nextFollowUpDate: new Date().toISOString().split('T')[0],
      nextFollowUpNote: 'Website direct inquiry',
      notes: [
        {
          id: 'note-' + Date.now(),
          text: message || 'Customer requested contact via showroom website.',
          createdAt: new Date().toISOString(),
          authorName: 'Showroom Web Form',
        },
      ],
      timeline: [
        {
          id: 'act-' + Date.now(),
          type: 'system',
          title: 'Direct Showroom Contact Form',
          description: message,
          timestamp: new Date().toISOString(),
          authorName: name,
        },
      ],
      enquiryDate: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    setSubmitted(true);
    success('Message Delivered', `The sales desk at ${dealer.name} will respond shortly.`);
  };

  const handleWhatsapp = () => {
    const text = encodeURIComponent(`Hello ${dealer.name}, I want to visit your showroom.`);
    window.open(`https://wa.me/${dealer.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col justify-between">
      <div>
        <ShowroomNavbar dealer={dealer} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h1 className="text-3xl font-extrabold text-[#182230]">
              Visit or Contact {dealer.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with our showroom team for test drives, car evaluations, and finance support
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Contact Details & Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-[#10151F] text-[#C6F36B] flex items-center justify-center font-bold text-lg">
                    {dealer.name[0]}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{dealer.name}</h3>
                    <p className="text-xs text-slate-500">{dealer.tagline}</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#54D7E8] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Showroom Address:</span>
                      <span className="text-slate-600 block mt-0.5">
                        {dealer.contact.address}, {dealer.contact.city}, {dealer.contact.state} - {dealer.contact.pincode}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Telephone & Mobile:</span>
                      <a href={`tel:${dealer.contact.phone}`} className="text-blue-600 font-bold hover:underline block mt-0.5">
                        {dealer.contact.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Email Address:</span>
                      <span className="text-slate-600 block mt-0.5">{dealer.contact.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">Showroom Hours:</span>
                      <span className="text-slate-600 block mt-0.5">
                        Monday - Saturday: 10:00 AM – 08:00 PM<br />
                        Sunday: 11:00 AM – 06:00 PM
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={handleWhatsapp}
                    className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Chat on WhatsApp</span>
                  </button>
                  <a
                    href={`tel:${dealer.contact.phone}`}
                    className="flex-1 py-3 rounded-xl bg-[#10151F] text-white font-bold text-xs hover:bg-[#182231] transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#C6F36B]" />
                    <span>Call Desk</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <h3 className="font-extrabold text-base text-slate-900 mb-2">Send Showroom Enquiry</h3>
              <p className="text-xs text-slate-500 mb-6">
                Have a specific question about financing, test drives, or exchange value? Write to us directly.
              </p>

              {submitted ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-slate-900 text-sm">Message Sent to {dealer.name}</h4>
                  <p className="text-xs text-slate-600">
                    A sales representative will call you on <strong>{phone}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-emerald-800 underline pt-2"
                  >
                    Send another query
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98XXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Your Message or Question</label>
                    <textarea
                      rows={4}
                      placeholder="e.g. I want to test drive the 2022 Creta tomorrow around 4 PM, is it available?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-[#10151F] text-white hover:bg-[#182231] font-extrabold text-xs transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#C6F36B]" />
                    <span>Submit Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShowroomFooter dealer={dealer} />
    </div>
  );
};
