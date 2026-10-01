import React, { useState } from 'react';
import { Donation, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { 
  Flame, 
  Clock, 
  UtensilsCrossed, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  AlertTriangle,
  ChevronRight,
  ShieldAlert,
  Leaf
} from 'lucide-react';

interface RestaurantDashboardProps {
  donations: Donation[];
  onOpenDonationModal: () => void;
  onSelectDonation: (donationId: string) => void;
  onOpenQrModal: (donation: Donation) => void;
  language: Language;
  isDarkMode?: boolean;
}

export const RestaurantDashboard: React.FC<RestaurantDashboardProps> = ({
  donations,
  onOpenDonationModal,
  onSelectDonation,
  onOpenQrModal,
  language,
  isDarkMode = false
}) => {
  const t = getTranslation(language);

  // Restaurant metrics calculation
  const totalMeals = donations.reduce((acc, curr) => acc + (parseInt(curr.quantity) || 40), 0);
  const totalKg = donations.reduce((acc, curr) => acc + (curr.quantityKg || 12), 0);
  const totalCo2 = Math.round(totalKg * 2.5);

  const activeDonations = donations.filter(d => d.status !== 'delivered' && d.status !== 'expired');
  const pastDonations = donations.filter(d => d.status === 'delivered');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-[16px] border relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-slate-800' 
          : 'bg-[#2E7D32] border-[#1B5E20] text-white shadow-md'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold backdrop-blur border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#FF9800]" />
              <span>Grand Spice Hotel & Catering (Verified Partner)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.restHeaderTitle}
            </h1>
            <p className="text-sm text-[#E8F5E9] max-w-2xl">
              {t.restHeaderSub}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDonationModal}
              className="px-5 py-3 rounded-[16px] bg-[#FF9800] hover:bg-[#F57C00] text-white font-extrabold text-sm shadow-lg flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Flame className="w-5 h-5 text-white fill-white" />
              <span>{t.newDonation}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-[16px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm transition-all hover:border-[#2E7D32]`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.statFoodSaved}</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
              🥗
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#81C784]">{totalKg} kg</span>
            <p className="text-[11px] text-slate-400 mt-1">Surplus food rescued</p>
          </div>
        </div>

        <div className={`p-5 rounded-[16px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm transition-all hover:border-[#FF9800]`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.statMealsServed}</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#FF9800] flex items-center justify-center font-bold">
              🍲
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#FF9800]">{totalMeals} Meals</span>
            <p className="text-[11px] text-slate-400 mt-1">Distributed to NGOs</p>
          </div>
        </div>

        <div className={`p-5 rounded-[16px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm transition-all hover:border-[#2E7D32]`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.statCo2Saved}</span>
            <div className="w-8 h-8 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center font-bold">
              <Leaf className="w-4 h-4 text-[#2E7D32]" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-[#2E7D32] dark:text-[#81C784]">{totalCo2} kg</span>
            <p className="text-[11px] text-slate-400 mt-1">Greenhouse emissions offset</p>
          </div>
        </div>

        <div className={`p-5 rounded-[16px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm transition-all hover:border-blue-500`}>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{t.statActiveDonations}</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              📦
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{activeDonations.length} Active</span>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting pickup/delivery</p>
          </div>
        </div>
      </div>

      {/* Active Donations Management Section */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <UtensilsCrossed className="w-5 h-5 text-emerald-600" />
              {t.activeDonationsTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time freshness monitoring, assigned volunteers & QR pickup validation
            </p>
          </div>

          <button
            onClick={onOpenDonationModal}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
          >
            + Add New
          </button>
        </div>

        {activeDonations.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-2xl">
              🍲
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No active food donations right now</p>
            <button
              onClick={onOpenDonationModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-md"
            >
              Donate Surplus Food
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeDonations.map(don => (
              <div
                key={don.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  don.isUrgent
                    ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                    : isDarkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50/50'
                }`}
              >
                <div>
                  {/* Category & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                      {don.foodCategory}
                    </span>
                    {don.isUrgent ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Urgent
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 capitalize">
                        {don.status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {/* Food Image & Details */}
                  <div className="mt-3 flex gap-3">
                    <img
                      src={don.image}
                      alt={don.foodName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{don.foodName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                        {don.quantity}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Prepared: {don.cookedTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Freshness Rating Meter */}
                  <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Sparkles className="w-3 h-3 text-teal-500" /> AI Freshness Score
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{don.aiQualityScore}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${don.aiQualityScore}%` }}
                      />
                    </div>
                    {don.aiRecommendation && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        💡 {don.aiRecommendation}
                      </p>
                    )}
                  </div>
                </div>

                {/* Handover & Action Tools */}
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                  <button
                    onClick={() => onSelectDonation(don.id)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 flex items-center gap-1"
                  >
                    View Map Route <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenQrModal(don)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-all"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{t.verifyQr}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed Donations History */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm space-y-3`}>
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          {t.recentDonationHistory}
        </h3>

        <div className="space-y-2">
          {pastDonations.map(don => (
            <div
              key={don.id}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center font-bold">
                  ✓
                </span>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{don.foodName}</span>
                  <p className="text-slate-400 text-[11px]">
                    Delivered to: {don.claimedByNgoName || 'Annam Relief Shelter'} • Volunteer: {don.assignedVolunteerName || 'Ramesh K.'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{don.quantity}</span>
                <span className="block text-[10px] text-slate-400">Verified Receipt</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
