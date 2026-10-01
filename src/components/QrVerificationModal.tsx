import React, { useState } from 'react';
import { Donation } from '../types';
import { QrCode, CheckCircle2, ShieldCheck, X, Camera } from 'lucide-react';

interface QrVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  donation: Donation | null;
  isDarkMode?: boolean;
}

export const QrVerificationModal: React.FC<QrVerificationModalProps> = ({
  isOpen,
  onClose,
  donation,
  isDarkMode = false
}) => {
  const [isScanned, setIsScanned] = useState(false);

  if (!isOpen || !donation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`max-w-md w-full rounded-3xl p-6 sm:p-8 border shadow-2xl relative text-center space-y-4 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center mx-auto text-xl">
          <QrCode className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Handover QR Code Verification</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Show this code to the assigned volunteer to verify authentic pickup for <span className="font-bold text-slate-900 dark:text-white">{donation.foodName}</span>
          </p>
        </div>

        {/* Generated SVG QR Code Simulation */}
        <div className="p-4 bg-white rounded-2xl border-2 border-dashed border-emerald-500 max-w-[220px] mx-auto shadow-inner space-y-2">
          <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-950 rounded-xl text-white font-mono text-[8px] aspect-square flex items-center justify-center">
            {/* Visual QR pattern blocks */}
            <div className="col-span-2 row-span-2 bg-emerald-500 rounded-sm" />
            <div className="col-span-1 bg-white rounded-sm" />
            <div className="col-span-2 row-span-2 bg-emerald-500 rounded-sm" />
            <div className="col-span-1 bg-amber-400 rounded-sm" />
            <div className="col-span-1 bg-white rounded-sm" />
            <div className="col-span-1 bg-emerald-400 rounded-sm" />
            <div className="col-span-2 row-span-2 bg-emerald-500 rounded-sm" />
            <div className="col-span-3 bg-white rounded-sm" />
          </div>
          <span className="text-[10px] font-mono text-slate-600 font-bold block tracking-widest">
            {donation.qrCode || 'QR_ECORESQ_VERIFY'}
          </span>
        </div>

        {isScanned ? (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 text-xs font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Handover Verified & Logged on Firebase!
          </div>
        ) : (
          <button
            onClick={() => setIsScanned(true)}
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Simulate Volunteer Camera Scan
          </button>
        )}

      </div>
    </div>
  );
};
