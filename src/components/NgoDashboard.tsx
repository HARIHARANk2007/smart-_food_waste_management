import React, { useState } from 'react';
import { Donation, Language, AIMatchRecommendation } from '../types';
import { getTranslation } from '../utils/translations';
import { 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Sparkles, 
  Bike, 
  CheckCircle2, 
  Filter, 
  Flame, 
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface NgoDashboardProps {
  donations: Donation[];
  onClaimDonation: (donationId: string) => void;
  onSelectDonation: (donationId: string) => void;
  language: Language;
  isDarkMode?: boolean;
}

export const NgoDashboard: React.FC<NgoDashboardProps> = ({
  donations,
  onClaimDonation,
  onSelectDonation,
  language,
  isDarkMode = false
}) => {
  const t = getTranslation(language);

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<boolean>(false);
  const [smartMatchResult, setSmartMatchResult] = useState<AIMatchRecommendation | null>(null);
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [matchingDonationId, setMatchingDonationId] = useState<string | null>(null);

  // Available food donations nearby
  const availableDonations = donations.filter(d => d.status === 'available');
  const claimedByMe = donations.filter(d => d.claimedByNgoId === 'ngo_001' || d.status === 'claimed' || d.status === 'in_transit');

  const filteredDonations = availableDonations.filter(d => {
    if (categoryFilter !== 'All' && d.foodCategory !== categoryFilter) return false;
    if (urgencyFilter && !d.isUrgent) return false;
    return true;
  });

  // Handle AI Smart Match preview
  const handleRunSmartMatch = async (don: Donation) => {
    setMatchingDonationId(don.id);
    setIsMatchingLoading(true);
    try {
      const res = await fetch('/api/ai/smart-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donation: don,
          ngos: [{ id: 'ngo_001', name: 'Annam Hunger Relief' }],
          volunteers: [{ id: 'vol_001', name: 'Ramesh Kumar', distanceKm: 1.8 }]
        })
      });
      const data = await res.json();
      if (data.success && data.match) {
        setSmartMatchResult(data.match);
      }
    } catch (err) {
      console.error("Smart match API error:", err);
    } finally {
      setIsMatchingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className={`p-6 rounded-[16px] border relative overflow-hidden ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border-slate-800' 
          : 'bg-[#2E7D32] border-[#1B5E20] text-white shadow-md'
      }`}>
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] text-[#2E7D32] text-xs font-bold backdrop-blur border border-white/20">
            <HeartHandshake className="w-4 h-4 text-[#FF9800]" />
            <span>Annam Hunger Relief Foundation (NGO Center)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {t.ngoHeaderTitle}
          </h1>
          <p className="text-sm text-[#E8F5E9] max-w-2xl">
            {t.ngoHeaderSub}
          </p>
        </div>
      </div>

      {/* Active Deliveries En Route to NGO */}
      {claimedByMe.length > 0 && (
        <div className={`p-6 rounded-2xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-blue-600 animate-bounce" />
              {t.trackingDelivery} ({claimedByMe.length})
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
              ⚡ Live GPS On Map
            </span>
          </div>

          <div className="space-y-3">
            {claimedByMe.map(don => (
              <div
                key={don.id}
                className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img src={don.image} alt={don.foodName} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{don.foodName}</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      From: {don.restaurantName} • Quantity: <span className="font-bold text-blue-600">{don.quantity}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{t.eta}: 8 mins • Volunteer Ramesh K. (En Route)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectDonation(don.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Track GPS Route
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Food Feed */}
      <div className={`p-6 rounded-2xl border ${
        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      } shadow-sm space-y-4`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              {t.nearbyDonations} ({filteredDonations.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Fresh surplus food within 5km radius ready for immediate rescue
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {['All', 'Cooked Meals', 'Bakery & Bread', 'Fresh Produce'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}

            <button
              onClick={() => setUrgencyFilter(!urgencyFilter)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                urgencyFilter
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              🚨 Urgent Only
            </button>
          </div>
        </div>

        {/* List of Donations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDonations.map(don => (
            <div
              key={don.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                don.isUrgent
                  ? 'border-rose-400 bg-rose-50/40 dark:bg-rose-950/20'
                  : isDarkMode ? 'border-slate-800 bg-slate-800/60' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                    {don.foodCategory}
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    Freshness: {don.aiQualityScore}%
                  </span>
                </div>

                <div className="mt-3 flex gap-3">
                  <img src={don.image} alt={don.foodName} className="w-16 h-16 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">{don.foodName}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{don.restaurantName}</p>
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-1">{don.quantity}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                  {don.description}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">📍 Location:</span>
                    <span className="font-semibold">{don.location.address.split(',')[1] || 'T. Nagar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">🌡️ Temp:</span>
                    <span className="font-semibold">{don.storageTemp}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRunSmartMatch(don)}
                  className="px-2.5 py-1.5 rounded-xl border border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-950"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  AI Match
                </button>

                <button
                  onClick={() => onClaimDonation(don.id)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
                >
                  {t.claimFoodBtn}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Smart Matching Preview Modal */}
      {matchingDonationId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full rounded-3xl p-6 border shadow-2xl space-y-4 ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500 animate-spin" />
                <h3 className="font-bold text-base">AI Smart Rescue Recommendation</h3>
              </div>
              <button
                onClick={() => setMatchingDonationId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {isMatchingLoading ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold text-slate-500">Calculating optimal volunteer & NGO assignment...</p>
              </div>
            ) : smartMatchResult ? (
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800">
                  <span className="font-bold text-blue-700 dark:text-blue-300 block mb-1">
                    🎯 Match Score: {smartMatchResult.matchScore}/100
                  </span>
                  <p className="text-slate-600 dark:text-slate-300">{smartMatchResult.reasoning}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 space-y-1">
                  <p className="font-bold">Recommended Volunteer: Ramesh Kumar</p>
                  <p className="text-slate-500">Distance: 1.8 km • Rating: 4.9⭐</p>
                </div>

                <button
                  onClick={() => {
                    onClaimDonation(matchingDonationId);
                    setMatchingDonationId(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-blue-600 text-white font-extrabold text-xs shadow-lg"
                >
                  Accept AI Matched Pickup
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
};
