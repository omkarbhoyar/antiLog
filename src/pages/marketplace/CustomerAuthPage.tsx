import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, DEMO_USERS } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Car, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2, User } from 'lucide-react';

export const CustomerAuthPage: React.FC = () => {
  const { loginAs, switchUser } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [mobile, setMobile] = useState('+91 98201 99887');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) {
      alert('Enter mobile number');
      return;
    }
    setOtpStep(true);
    success('OTP Sent', 'Demo verification code is 123456');
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      alert('Please enter demo code 123456');
      return;
    }

    loginAs({
      id: 'cust-' + Date.now(),
      name: name || 'Aarav Sharma',
      email: email || 'aarav.sharma@example.com',
      phone: mobile,
      role: 'customer',
      city: 'Nagpur',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
    });

    success('Signed In Successfully!', 'Welcome back to Antilog.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#10151F] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#182231] rounded-3xl p-8 border border-[#233044] shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#C6F36B]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-[#10151F] border border-[#C6F36B]/40 flex items-center justify-center">
              <Car className="w-6 h-6 text-[#C6F36B]" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              ANTI<span className="text-[#C6F36B]">LOG</span>
            </span>
          </Link>
          <h2 className="text-xl font-extrabold text-white">
            {otpStep ? 'Verify Mobile OTP' : mode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {otpStep
              ? 'Enter the 6-digit code sent to ' + mobile
              : 'Save cars, post requirements, and book instant test drives'}
          </p>
        </div>

        {/* Tab switch if not in OTP step */}
        {!otpStep && (
          <div className="flex bg-[#10151F] p-1 rounded-xl mb-6 border border-[#233044]">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'bg-[#182231] text-[#C6F36B] shadow' : 'text-slate-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'bg-[#182231] text-[#C6F36B] shadow' : 'text-slate-400'
              }`}
            >
              Register
            </button>
          </div>
        )}

        {otpStep ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Enter OTP (Demo: 123456)
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-[#C6F36B] focus:outline-none focus:border-[#C6F36B]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C6F36B] text-[#10151F] font-extrabold text-xs hover:bg-[#b0df57] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Continue</span>
            </button>

            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="w-full text-center text-xs text-slate-400 hover:text-white pt-2"
            >
              Change Mobile Number
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Aarav Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C6F36B]"
                  required
                />
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Mobile Phone Number</label>
              <input
                type="tel"
                placeholder="+91 98XXX XXXXX"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-[#10151F] border border-[#233044] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#C6F36B]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C6F36B] text-[#10151F] font-extrabold text-xs hover:bg-[#b0df57] transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Get OTP via SMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Quick Demo Fast-Login Strip */}
        <div className="mt-8 pt-6 border-t border-[#233044] text-center space-y-3">
          <p className="text-[11px] text-slate-400">⚡ Evaluator Quick Logins:</p>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => {
                switchUser('customer');
                navigate('/');
              }}
              className="p-2 rounded-lg bg-[#10151F] border border-[#233044] hover:border-slate-500 text-slate-300 font-semibold"
            >
              Buyer (Aarav)
            </button>
            <button
              onClick={() => {
                switchUser('dealer_om');
                navigate('/dealer/dashboard');
              }}
              className="p-2 rounded-lg bg-[#10151F] border border-[#C6F36B]/40 hover:border-[#C6F36B] text-[#C6F36B] font-bold"
            >
              OM Cars Owner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
