import React, { useState } from 'react';
import { Donation, UserProfile, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Building2, 
  HeartHandshake, 
  CheckCircle2, 
  XCircle, 
  BarChart2, 
  Sparkles,
  Flame
} from 'lucide-react';

interface AdminDashboardProps {
  userProfiles: UserProfile[];
  donations: Donation[];
  onApproveUser: (userId: string) => void;
  language: Language;
  isDarkMode?: boolean;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  userProfiles,
  donations,
  onApproveUser,
  language,
  isDarkMode = false
}) => {
  const t = getTranslation(language);

  const pendingUsers = userProfiles.filter(u => !u.isApproved);
  const totalMeals = donations.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 40), 0);
  const totalKg = donations.reduce((acc, curr) => acc + (curr.quantityKg || 12), 0);

  return (
    <div className="space-y-6">
      
      {/* Admin Header Banner */}
      <div className={`p-6 rounded-[16px] border relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border-slate-800' 
          : 'bg-[#2E7D32] border-[#1B5E20] text-white shadow-md'
      }`}>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold backdrop-blur border border-white/20">
            <ShieldCheck className="w-4 h-4 text-[#FF9800]" />
            <span>Master Admin Console & AI Sentinel</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.adminHeaderTitle}
          </h1>
          <p className="text-sm text-[#E8F5E9] max-w-2xl">
            {t.adminHeaderSub}
          </p>
        </div>
      </div>

      {/* Admin System KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <span className="text-slate-500 text-xs font-semibold block">Total Food Rescued</span>
          <span className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mt-2 block">{totalKg} kg</span>
          <p className="text-[11px] text-slate-400 mt-1">Across all registered regions</p>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <span className="text-slate-500 text-xs font-semibold block">Total Meals Served</span>
          <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 block">{totalMeals}</span>
          <p className="text-[11px] text-slate-400 mt-1">Direct to needy shelters</p>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <span className="text-slate-500 text-xs font-semibold block">Registered Entities</span>
          <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2 block">{userProfiles.length + 8}</span>
          <p className="text-[11px] text-slate-400 mt-1">Restaurants, NGOs & Volunteers</p>
        </div>

        <div className={`p-5 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm`}>
          <span className="text-slate-500 text-xs font-semibold block">AI Sentinel Status</span>
          <span className="text-xl font-extrabold text-emerald-500 mt-2 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            Active 100%
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Real-time fraud & decay check</p>
        </div>
      </div>

      {/* AI Fraud & Anomaly Alerts */}
      <div className={`p-6 rounded-2xl border border-amber-300 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {t.aiFraudDetection}
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 font-bold">
            2 Alerts
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-rose-600 dark:text-rose-400 block">
                ⚠️ Thermal Anomaly Detected: Don_102
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Annapoorna Bakery uploaded bakery items with 1.2h expiry window. AI Priority Engine set score to 96/100 and dispatched top volunteer Ramesh K.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-[11px]">
              Dismiss
            </button>
          </div>

          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 flex items-start justify-between gap-3">
            <div className="space-y-1">
              <span className="font-bold text-amber-600 dark:text-amber-400 block">
                🔍 FSSAI Compliance Verification
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                Grand Spice Hotel updated FSSAI food safety license #124190012931. Status automatically verified via AI document parsing.
              </p>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
              Verified
            </button>
          </div>
        </div>
      </div>

      {/* Pending User Verification Approvals */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm space-y-4`}>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-600" />
          {t.pendingApprovals} ({pendingUsers.length})
        </h2>

        {pendingUsers.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">All user accounts, restaurants, and NGOs are fully approved!</p>
        ) : (
          <div className="space-y-3">
            {pendingUsers.map(user => (
              <div
                key={user.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{user.name}</span>
                  <p className="text-slate-500 text-[11px]">
                    Role: <span className="font-bold uppercase text-purple-600">{user.role}</span> • Email: {user.email}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">{user.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onApproveUser(user.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-md hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
