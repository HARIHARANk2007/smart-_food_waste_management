export type UserRole = 'restaurant' | 'ngo' | 'volunteer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  organizationName?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export type FoodUrgency = 'Urgent' | 'Normal';
export type DonationStatus = 'Ready' | 'Claimed' | 'In Transit' | 'Delivered' | 'Expired';

export interface Donation {
  id: string;
  title: string;
  amount: string;
  location: string;
  time: string;
  urgency: FoodUrgency;
  status: DonationStatus;
  color: string;
  donorName?: string;
  donorPhone?: string;
  foodCategory?: string;
  storageTemp?: string;
  cookedHoursAgo?: number;
  freshnessScore?: number;
  qualityRating?: 'Fresh' | 'Medium' | 'Unsafe';
  shelfLifeRemainingHours?: number;
  safetyAdvice?: string;
  imageUrl?: string;
  qrCode?: string;
  claimedByNgoId?: string;
  assignedVolunteerId?: string;
  distanceKm?: number;
  createdAt?: string;
}

export interface AiQualityPrediction {
  freshnessPercentage: number;
  quality: 'Fresh' | 'Medium' | 'Unsafe';
  priorityScore: number;
  shelfLifeEstimateHours: number;
  recommendation: string;
  analysisDetails: string[];
}

export interface SmartMatchResult {
  recommendedNgoId: string;
  recommendedVolunteerId: string;
  matchScore: number;
  reasoning: string;
}

export interface CarbonImpact {
  co2eSavedKg: number;
  waterSavedLiters: number;
  methanePreventedKg: number;
  summary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
