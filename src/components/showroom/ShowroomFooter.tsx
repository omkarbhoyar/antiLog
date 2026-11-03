import React from 'react';
import { Link } from 'react-router-dom';
import { Dealer } from '@/types/dealer';
import { MapPin, Phone, Mail, Clock, MessageCircle, ShieldCheck } from 'lucide-react';

interface ShowroomFooterProps {
  dealer: Dealer;
}

export const ShowroomFooter: React.FC<ShowroomFooterProps> = ({ dealer }) => {
  return (
    <footer className="bg-[#10151F] text-slate-400 border-t border-[#233044] pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#233044]">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src={dealer.logo} alt={dealer.name} className="w-8 h-8 rounded-lg object-cover" />
              <h3 className="text-white font-extrabold text-base">{dealer.name}</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">{dealer.tagline}</p>
            <div className="pt-1">
              <span className="text-[11px] font-mono text-[#C6F36B] bg-[#182231] px-2.5 py-1 rounded border border-[#233044]">
                https://{dealer.customDomain}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Showroom Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to={`/showroom/${dealer.slug}`} className="hover:text-white">
                  Showroom Homepage
                </Link>
              </li>
              <li>
                <Link to={`/showroom/${dealer.slug}/cars`} className="hover:text-white">
                  Available Vehicles
                </Link>
              </li>
              <li>
                <Link to={`/showroom/${dealer.slug}/contact`} className="hover:text-white">
                  Location & Hours
                </Link>
              </li>
              <li>
                <Link to="/" className="text-[#C6F36B] hover:underline">
                  Antilog Central Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Visit Showroom
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {dealer.contact.address}, {dealer.contact.city}, {dealer.contact.state} - {dealer.contact.pincode}
            </p>
            <div className="mt-3 space-y-1 text-xs">
              <p>📞 Phone: <strong>{dealer.contact.phone}</strong></p>
              <p>💬 WhatsApp: <strong>{dealer.contact.whatsapp}</strong></p>
              <p>✉️ Email: <strong>{dealer.contact.email}</strong></p>
            </div>
          </div>

          {/* Inspection and Assurance */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Our Customer Guarantee
            </h4>
            <div className="p-3 rounded-xl bg-[#182231] border border-[#233044] space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-1.5 text-[#C6F36B] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Certified Inspection</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Every vehicle is subjected to our comprehensive 150-point diagnostic inspection prior to listing.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {dealer.name}. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span>Powered by</span>
            <Link to="/" className="font-extrabold text-[#C6F36B] hover:underline">
              Antilog Automotive OS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
