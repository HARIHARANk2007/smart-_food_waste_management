import React, { useState, useEffect } from 'react';
import { Donation, VolunteerProfile, UserProfile } from '../types';
import { MapPin, Navigation, Bike, Building2, HeartHandshake, Clock, ShieldCheck, Play, Pause, RefreshCw } from 'lucide-react';

interface InteractiveMapProps {
  donations: Donation[];
  volunteers: VolunteerProfile[];
  userProfiles: UserProfile[];
  selectedDonationId?: string;
  onSelectDonation?: (donationId: string) => void;
  isDarkMode?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  donations,
  volunteers,
  userProfiles,
  selectedDonationId,
  onSelectDonation,
  isDarkMode = false
}) => {
  const [activeDonation, setActiveDonation] = useState<Donation | null>(
    donations.find(d => d.id === selectedDonationId) || donations[0] || null
  );

  const [isLiveSimulating, setIsLiveSimulating] = useState(true);
  const [volunteerProgress, setVolunteerProgress] = useState(0.4); // 0 to 1 along route
  const [showTraffic, setShowTraffic] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'available' | 'in_transit' | 'urgent'>('all');

  useEffect(() => {
    if (selectedDonationId) {
      const found = donations.find(d => d.id === selectedDonationId);
      if (found) setActiveDonation(found);
    }
  }, [selectedDonationId, donations]);

  // Live GPS Movement Simulation ticker
  useEffect(() => {
    if (!isLiveSimulating) return;
    const interval = setInterval(() => {
      setVolunteerProgress(prev => (prev >= 0.95 ? 0.05 : prev + 0.03));
    }, 1200);
    return () => clearInterval(interval);
  }, [isLiveSimulating]);

  // Base map boundaries (Chennai sample area: 12.95 to 13.10 Lat, 80.20 to 80.28 Lng)
  const minLat = 12.96;
  const maxLat = 13.09;
  const minLng = 80.21;
  const maxLng = 80.28;

  // Convert GPS (Lat, Lng) to Canvas SVG % (X, Y)
  const gpsToCoords = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y))
    };
  };

  // Coordinates for active donation route
  const restCoord = activeDonation ? gpsToCoords(activeDonation.location.lat, activeDonation.location.lng) : { x: 45, y: 35 };
  const ngoCoord = { x: 75, y: 65 }; // NGO location
  
  // Volunteer moving coordinate interpolation along route line
  const volCoord = {
    x: restCoord.x + (ngoCoord.x - restCoord.x) * volunteerProgress,
    y: restCoord.y + (ngoCoord.y - restCoord.y) * volunteerProgress
  };

  const filteredDonations = donations.filter(d => {
    if (filterType === 'available') return d.status === 'available';
    if (filterType === 'in_transit') return d.status === 'in_transit' || d.status === 'claimed';
    if (filterType === 'urgent') return d.isUrgent;
    return true;
  });

  return (
    <div className={`rounded-2xl border overflow-hidden shadow-lg flex flex-col lg:flex-row h-[600px] ${
      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
    }`}>
      {/* Sidebar List of Locations / Active Missions */}
      <div className={`w-full lg:w-80 border-b lg:border-b-0 lg:border-r p-4 overflow-y-auto flex flex-col gap-3 ${
        isDarkMode ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-slate-50'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm tracking-wide flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Navigation className="w-4 h-4" />
            Live Rescue GPS Radar
          </h3>
          <button
            onClick={() => setIsLiveSimulating(!isLiveSimulating)}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isLiveSimulating
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
            }`}
          >
            {isLiveSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLiveSimulating ? 'Live GPS' : 'Paused'}
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg ${filterType === 'all' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('urgent')}
            className={`px-2.5 py-1 rounded-lg ${filterType === 'urgent' ? 'bg-rose-600 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            🚨 Urgent
          </button>
          <button
            onClick={() => setFilterType('available')}
            className={`px-2.5 py-1 rounded-lg ${filterType === 'available' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-200 dark:bg-slate-800'}`}
          >
            Ready
          </button>
        </div>

        {/* Donation Pins List */}
        <div className="space-y-2 mt-1">
          {filteredDonations.map(don => {
            const isSelected = activeDonation?.id === don.id;
            return (
              <div
                key={don.id}
                onClick={() => {
                  setActiveDonation(don);
                  if (onSelectDonation) onSelectDonation(don.id);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-xs line-clamp-1">{don.foodName}</span>
                  {don.isUrgent && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-rose-500 text-white font-bold rounded animate-pulse">
                      Urgent
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                  <span>{don.restaurantName}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{don.quantity}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    Freshness: {don.aiQualityScore}%
                  </span>
                  <span className="text-slate-400">📍 {don.location.address.split(',')[1] || 'Chennai'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Map Interactive Canvas */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden">
        {/* Map Background Tiles / Roads Pattern */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px]" />
        
        {/* SVG Route Lines & Area Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Simulated Road Grid Lines */}
          <line x1="10%" y1="20%" x2="90%" y2="20%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="10%" y1="80%" x2="90%" y2="80%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="30%" y1="10%" x2="30%" y2="90%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="70%" y1="10%" x2="70%" y2="90%" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 4" />

          {/* Active Route Polyline Path */}
          {activeDonation && (
            <>
              {/* Glow Route Line */}
              <line
                x1={`${restCoord.x}%`}
                y1={`${restCoord.y}%`}
                x2={`${ngoCoord.x}%`}
                y2={`${ngoCoord.y}%`}
                stroke="url(#routeGradient)"
                strokeWidth="5"
                strokeDasharray="8 4"
                filter="url(#glow)"
              />

              {/* Travel Completed Segment */}
              <line
                x1={`${restCoord.x}%`}
                y1={`${restCoord.y}%`}
                x2={`${volCoord.x}%`}
                y2={`${volCoord.y}%`}
                stroke="#f59e0b"
                strokeWidth="5"
              />
            </>
          )}
        </svg>

        {/* Restaurant Pin Marker */}
        {activeDonation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            style={{ left: `${restCoord.x}%`, top: `${restCoord.y}%` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-10 rounded-full bg-emerald-500/30 animate-ping" />
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-1 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded shadow-md border border-slate-700 whitespace-nowrap">
              📍 {activeDonation.restaurantName}
            </div>
          </div>
        )}

        {/* NGO Pin Marker */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
          style={{ left: `${ngoCoord.x}%`, top: `${ngoCoord.y}%` }}
        >
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-1 bg-slate-900/90 text-white text-[10px] px-2 py-1 rounded shadow-md border border-slate-700 whitespace-nowrap">
            🏢 Annam Relief Shelter
          </div>
        </div>

        {/* Animated Live Volunteer GPS Marker */}
        {activeDonation && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 ease-out"
            style={{ left: `${volCoord.x}%`, top: `${volCoord.y}%` }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 rounded-full bg-amber-500/40 animate-pulse" />
              <div className="w-9 h-9 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shadow-xl ring-4 ring-amber-400/50">
                <Bike className="w-5 h-5 animate-bounce" />
              </div>
            </div>
            <div className="mt-1 bg-amber-400 text-slate-950 font-extrabold text-[10px] px-2 py-0.5 rounded shadow-lg whitespace-nowrap flex items-center gap-1">
              <span>⚡ Ramesh (Volunteer)</span>
              <span>{Math.round(volunteerProgress * 100)}%</span>
            </div>
          </div>
        )}

        {/* Map Header Floating Overlay */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 text-white px-3 py-2 rounded-xl text-xs flex items-center gap-3 shadow-lg pointer-events-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold">Live GPS Tracker</span>
            </div>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> ETA: {Math.max(2, Math.round((1 - volunteerProgress) * 14))} mins
            </span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur border border-slate-800 text-white px-2 py-1 rounded-xl text-[11px] flex items-center gap-2 pointer-events-auto">
            <button
              onClick={() => setShowTraffic(!showTraffic)}
              className={`px-2 py-1 rounded ${showTraffic ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              Traffic Overlay
            </button>
          </div>
        </div>

        {/* Bottom Floating Active Route Card */}
        {activeDonation && (
          <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur border border-slate-800 text-white p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <img
                src={activeDonation.image}
                alt={activeDonation.foodName}
                className="w-14 h-14 rounded-xl object-cover border border-slate-700"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-emerald-400">{activeDonation.foodName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                    {activeDonation.quantity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pickup: {activeDonation.restaurantName} → Drop: Annam Relief Shelter
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end text-xs">
              <div className="text-right">
                <span className="block font-bold text-amber-400 text-sm">
                  {(1.8 * (1 - volunteerProgress)).toFixed(1)} km away
                </span>
                <span className="text-slate-400 text-[10px]">Optimal Route</span>
              </div>
              <button
                onClick={() => alert(`Shared live tracking link for ${activeDonation.foodName}`)}
                className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/30"
              >
                Share GPS Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
