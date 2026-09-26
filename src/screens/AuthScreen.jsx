import React, { useState } from 'react';
import { Package, Lock, Mail, User, Shield, Phone, KeyRound, ArrowRight, CheckCircle } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

export const AuthScreen = () => {
  const { login, signup, resetPasswordWithOtp, showToast } = useInventory();

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [email, setEmail] = useState('alex.mercer@ims.logistics.io');
  const [password, setPassword] = useState('admin123');

  // Signup fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Inventory Manager');
  const [warehouse, setWarehouse] = useState('WH-1 (Central Depot)');

  // Forgot password fields
  const [otpStep, setOtpStep] = useState(1); // 1: Send OTP, 2: Verify & Reset
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    signup({ name, email, phone, role, warehouse, password });
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email or phone number', 'error');
      return;
    }
    showToast(`Verification code sent to ${email}. Demo OTP: 123456`, 'info');
    setOtpStep(2);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    const ok = resetPasswordWithOtp(email, otp, newPassword);
    if (ok) {
      setMode('login');
      setOtpStep(1);
      setOtp('');
    }
  };

  const setDemoAccount = (roleType) => {
    if (roleType === 'manager') {
      setEmail('alex.mercer@ims.logistics.io');
      setPassword('admin123');
    } else {
      setEmail('sarah.jenkins@ims.logistics.io');
      setPassword('staff123');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Glow Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Mobile Card Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* App Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-indigo-600 shadow-xl shadow-sky-500/25 ring-2 ring-white/20 mb-3">
            <Package className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">IMS</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Digital Inventory & Warehouse Platform</p>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">Email / Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com or phone"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setOtpStep(1); }}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-sky-600/30 transition duration-150 flex items-center justify-center space-x-2 text-sm mt-2"
            >
              <span>Login to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Quick Demo Credentials */}
            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-[11px] text-center text-slate-400 uppercase font-bold tracking-wider mb-2">Quick Demo Accounts</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDemoAccount('manager')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-medium text-slate-300 border border-slate-700/60 text-center"
                >
                  👤 Inventory Mgr
                </button>
                <button
                  type="button"
                  onClick={() => setDemoAccount('staff')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-[11px] font-medium text-slate-300 border border-slate-700/60 text-center"
                >
                  👷 Warehouse Staff
                </button>
              </div>
            </div>

            <p className="text-xs text-center text-slate-400 pt-2">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-sky-400 font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Warehouse Staff">Warehouse Staff</option>
                  <option value="Logistics Coordinator">Logistics Supervisor</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Warehouse</label>
                <select
                  value={warehouse}
                  onChange={(e) => setWarehouse(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="WH-1 (Central Depot)">WH-1 Main Depot</option>
                  <option value="WH-2 (North Regional Hub)">WH-2 North Hub</option>
                  <option value="WH-3 (East Fulfillment Facility)">WH-3 East Facility</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg transition duration-150 text-xs mt-2"
            >
              Create Account
            </button>

            <p className="text-xs text-center text-slate-400 pt-1">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-sky-400 font-semibold hover:underline"
              >
                Log In
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD WITH OTP FORM */}
        {mode === 'forgot' && (
          <div>
            {otpStep === 1 ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <p className="text-xs text-slate-300">
                  Enter your registered email address or phone number to receive a 6-digit OTP verification code.
                </p>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Email / Phone</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition"
                >
                  Send OTP Code
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-3 text-xs text-sky-300">
                  Enter 6-digit OTP sent to {email}. <br/>
                  <strong className="text-white">Demo OTP Code: 123456</strong>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">6-Digit OTP</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center space-x-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Reset & Save Password</span>
                </button>
              </form>
            )}

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-slate-400 hover:text-white"
              >
                ← Back to Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
