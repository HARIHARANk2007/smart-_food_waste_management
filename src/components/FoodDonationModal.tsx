import React, { useState } from 'react';
import { Donation, FoodCategory, AIQualityAnalysis, Language } from '../types';
import { getTranslation } from '../utils/translations';
import { Sparkles, Camera, Flame, X, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface FoodDonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitDonation: (donationData: Partial<Donation>) => void;
  language: Language;
  isDarkMode?: boolean;
}

export const FoodDonationModal: React.FC<FoodDonationModalProps> = ({
  isOpen,
  onClose,
  onSubmitDonation,
  language,
  isDarkMode = false
}) => {
  const t = getTranslation(language);

  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantity, setQuantity] = useState('50 Meals');
  const [quantityKg, setQuantityKg] = useState(15);
  const [storageTemp, setStorageTemp] = useState<'Hot' | 'Room Temp' | 'Refrigerated' | 'Frozen'>('Hot');
  const [cookedHoursAgo, setCookedHoursAgo] = useState(2);
  const [expiryHours, setExpiryHours] = useState(4);
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('124 Anna Salai, Thousand Lights, Chennai');
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80');

  const [aiAnalysis, setAiAnalysis] = useState<AIQualityAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  // Handle Gemini AI Quality Scan
  const handleScanFreshness = async () => {
    setIsScanning(true);
    try {
      const res = await fetch('/api/ai/quality-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          foodName,
          foodCategory: category,
          storageTemp,
          cookedHoursAgo,
          imageBase64: imagePreview
        })
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      }
    } catch (err) {
      console.error("AI freshness scan error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName) return;

    const newDonation: Partial<Donation> = {
      restaurantId: 'rest_001',
      restaurantName: 'Grand Spice Hotel & Catering',
      restaurantPhone: '+91 98401 12345',
      foodName,
      foodCategory: category,
      quantity,
      quantityKg: Number(quantityKg) || 12,
      description: description || 'Fresh surplus prepared under hygienic thermal conditions.',
      storageTemp,
      cookedTime: `${cookedHoursAgo} hours ago`,
      expiryTime: new Date(Date.now() + expiryHours * 3600 * 1000).toISOString(),
      pickupTime: 'Immediate Pickup',
      location: { lat: 13.0604, lng: 80.2496, address },
      image: imagePreview,
      status: 'available',
      createdAt: new Date().toISOString(),
      aiQualityScore: aiAnalysis ? aiAnalysis.freshnessPercentage : 92,
      aiQualityLabel: aiAnalysis ? aiAnalysis.quality : 'Fresh',
      aiRecommendation: aiAnalysis ? aiAnalysis.recommendation : 'Suitable for immediate rescue.',
      priorityScore: aiAnalysis ? aiAnalysis.priorityScore : (expiryHours <= 2 ? 95 : 80),
      isUrgent: expiryHours <= 2 || (aiAnalysis && aiAnalysis.priorityScore > 90) || false,
      qrCode: `QR_DON_${Date.now()}`
    };

    onSubmitDonation(newDonation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`max-w-xl w-full rounded-3xl p-6 sm:p-8 border shadow-2xl relative my-8 ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>EcoResQ Food Rescue Network</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {t.newDonation}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish surplus food details for instant NGO matching and volunteer dispatch
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Food Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.foodName} *
              </label>
              <input
                type="text"
                required
                value={foodName}
                onChange={e => setFoodName(e.target.value)}
                placeholder="e.g. Veg Biryani & Paneer Curry"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.category} *
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as FoodCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Cooked Meals">Cooked Meals</option>
                <option value="Bakery & Bread">Bakery & Bread</option>
                <option value="Fresh Produce">Fresh Produce</option>
                <option value="Packaged Goods">Packaged Goods</option>
                <option value="Dairy & Beverages">Dairy & Beverages</option>
                <option value="Desserts & Sweets">Desserts & Sweets</option>
              </select>
            </div>
          </div>

          {/* Quantity & Storage Temperature */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.quantity} *
              </label>
              <input
                type="text"
                required
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                placeholder="e.g. 50 Meals or 15 kg"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={quantityKg}
                onChange={e => setQuantityKg(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                {t.storageTemp}
              </label>
              <select
                value={storageTemp}
                onChange={e => setStorageTemp(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Hot">Hot (&gt; 60°C)</option>
                <option value="Room Temp">Room Temp</option>
                <option value="Refrigerated">Refrigerated (4°C)</option>
                <option value="Frozen">Frozen (-18°C)</option>
              </select>
            </div>
          </div>

          {/* Preparation & Expiry Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Prepared: {cookedHoursAgo} hours ago
              </label>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={cookedHoursAgo}
                onChange={e => setCookedHoursAgo(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Safe Consumption Limit: {expiryHours} hours
              </label>
              <input
                type="range"
                min="1"
                max="12"
                step="0.5"
                value={expiryHours}
                onChange={e => setExpiryHours(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Description & Address */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Description / Handling Instructions
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Packed in thermal covered containers..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
            />
          </div>

          {/* Gemini AI Quality Scanner CTA Card */}
          <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
                <span className="font-bold text-xs text-teal-900 dark:text-teal-200">
                  {t.aiFreshnessPredictor}
                </span>
              </div>
              <button
                type="button"
                onClick={handleScanFreshness}
                disabled={isScanning}
                className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                {isScanning ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{isScanning ? 'Scanning...' : t.predictFreshnessBtn}</span>
              </button>
            </div>

            {aiAnalysis && (
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-800 text-xs space-y-1.5">
                <div className="flex justify-between font-bold">
                  <span className="text-teal-700 dark:text-teal-300">
                    Freshness Score: {aiAnalysis.freshnessPercentage}% ({aiAnalysis.quality})
                  </span>
                  <span className="text-amber-600">Priority: {aiAnalysis.priorityScore}/100</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{aiAnalysis.recommendation}</p>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-[16px] border border-slate-200 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-3 rounded-[16px] bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-extrabold text-xs shadow-xl shadow-[#2E7D32]/20"
            >
              {t.submitDonation}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
