import React, { useState } from 'react';
import { Donation, VolunteerProfile, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { 
  Bike, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  QrCode, 
  Trophy, 
  Award, 
  Navigation, 
  Camera, 
  ShieldCheck,
  Star,
  ChevronRight
} from 'lucide-react';

interface VolunteerDashboardProps {
  volunteers: VolunteerProfile[];
  donations: Donation[];
  onOpenQrModal: (donation: Donation) => void;
  onSelectDonation: (donationId: string) => void;
  onConfirmDelivery: (donationId: string) => void;
  language: Language;
  isDarkMode?: boolean;
}

export const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({
  volunteers,
  donations,
  onOpenQrModal,
  onSelectDonation,
  onConfirmDelivery,
  language,
  isDarkMode = false
}) => {
  const t = getTranslation(language);
  const me = volunteers[0] || {
    name: 'Ramesh Kumar',
    completedDeliveries: 42,
    rewardPoints: 850,
    rating: 4.9,
    badges: ['Eco Champion 🏆', 'Speedy Rescue ⚡', 'Night Rider 🌙']
  };

  const assignedTasks = donations.filter(d => d.status === 'claimed' || d.status === 'in_transit');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-[16px] border relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 border-slate-800' 
          : 'bg-[#2E7D32] border-[#1B5E20] text-white shadow-md'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold backdrop-blur border border-white/20">
              <Bike className="w-4 h-4 text-[#FF9800]" />
              <span>Active Rescue Volunteer: {me.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t.volHeaderTitle}
            </h1>
            <p className="text-sm text-[#E8F5E9] max-w-2xl">
              {t.volHeaderSub}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur p-4 rounded-[16px] border border-white/20">
            <div className="text-center">
              <span className="text-2xl font-extrabold text-[#FF9800]">{me.rewardPoints}</span>
              <span className="block text-[10px] text-[#E8F5E9] font-semibold">{t.rewardPoints}</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <span className="text-2xl font-extrabold text-white">{me.completedDeliveries}</span>
              <span className="block text-[10px] text-[#E8F5E9] font-semibold">Deliveries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Rescue Missions */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Navigation className="w-5 h-5 text-amber-500" />
            {t.assignedTasks} ({assignedTasks.length})
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 font-bold">
            GPS Turn-By-Turn Ready
          </span>
        </div>

        {assignedTasks.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl space-y-2">
            <p className="text-sm font-semibold text-slate-500">No active rescue missions assigned right now</p>
            <p className="text-xs text-slate-400">You will receive push notifications when new food is claimed nearby!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedTasks.map(don => (
              <div
                key={don.id}
                className="p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={don.image} alt={don.foodName} className="w-16 h-16 rounded-xl object-cover" />
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200">
                        {don.foodCategory}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">{don.foodName}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Quantity: <span className="font-bold text-amber-600">{don.quantity}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectDonation(don.id)}
                      className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      Map Navigation
                    </button>
                    <button
                      onClick={() => onOpenQrModal(don)}
                      className="px-3 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center gap-1 shadow"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      Verify Pickup QR
                    </button>
                  </div>
                </div>

                {/* Pickup to Delivery Stepper */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">📍 1. Pickup Location</span>
                    <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">{don.restaurantName}</span>
                    <span className="text-slate-500 text-[11px]">{don.location.address}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">🏢 2. Drop Shelter</span>
                    <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">{don.claimedByNgoName || 'Annam Relief Shelter'}</span>
                    <span className="text-slate-500 text-[11px]">42 Usman Road, T. Nagar</span>
                  </div>
                </div>

                {/* Final Confirm Delivery Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" /> Complete within 45 mins to earn +50 points
                  </span>
                  <button
                    onClick={() => onConfirmDelivery(don.id)}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.confirmDelivery}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard & Achievements Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Badges & Rewards */}
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            My Achievements & Eco Badges
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {me.badges.map((badge, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-center space-y-1">
                <span className="text-2xl block">🥇</span>
                <span className="font-bold text-xs text-amber-900 dark:text-amber-200 block">{badge}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Leaderboard */}
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}>
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            {t.leaderboardTitle}
          </h3>

          <div className="space-y-2">
            {volunteers.map((vol, idx) => (
              <div
                key={vol.id}
                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full font-extrabold flex items-center justify-center text-xs ${
                    idx === 0 ? 'bg-amber-400 text-slate-950' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    #{idx + 1}
                  </span>
                  <img src={vol.profileImage} alt={vol.name} className="w-8 h-8 rounded-full object-cover" />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{vol.name}</span>
                    <span className="text-slate-400 text-[10px] block">{vol.completedDeliveries} Deliveries</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400">{vol.rewardPoints} pts</span>
                  <span className="text-slate-400 text-[10px] block flex items-center gap-0.5 justify-end">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {vol.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
