export type UserRole = 'restaurant' | 'ngo' | 'volunteer' | 'admin';

export type FoodCategory = 
  | 'Cooked Meals' 
  | 'Bakery & Bread' 
  | 'Fresh Produce' 
  | 'Packaged Goods' 
  | 'Dairy & Beverages' 
  | 'Desserts & Sweets';

export type DonationStatus = 'available' | 'claimed' | 'in_transit' | 'delivered' | 'expired';

export type Language = 'en' | 'ta';

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  profileImage: string;
  address: string;
  location: Location;
  isApproved: boolean;
  createdAt: string;
}

export interface Donation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  restaurantPhone: string;
  foodName: string;
  foodCategory: FoodCategory;
  quantity: string; // e.g., "50 Meals" or "15 kg"
  quantityKg: number; // numerical for carbon math
  description: string;
  storageTemp: 'Hot' | 'Room Temp' | 'Refrigerated' | 'Frozen';
  cookedTime: string;
  expiryTime: string; // ISO or relative timestamp
  pickupTime: string;
  location: Location;
  image: string;
  status: DonationStatus;
  createdAt: string;
  aiQualityScore: number; // 0 - 100
  aiQualityLabel: 'Fresh' | 'Medium' | 'Unsafe';
  aiRecommendation?: string;
  priorityScore: number; // 0 - 100
  isUrgent: boolean;
  claimedByNgoId?: string;
  claimedByNgoName?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  qrCode?: string;
}

export interface ClaimRequest {
  id: string;
  donationId: string;
  ngoId: string;
  ngoName: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  status: 'pending' | 'accepted' | 'in_transit' | 'completed' | 'cancelled';
  pickupTime: string;
  deliveryTime?: string;
  deliveryProofImage?: string;
  createdAt: string;
}

export interface VolunteerProfile extends UserProfile {
  completedDeliveries: number;
  rewardPoints: number;
  rating: number;
  currentLocation: Location;
  isAvailable: boolean;
  badges: string[];
}

export interface NotificationItem {
  id: string;
  receiverRole: UserRole | 'all';
  title: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
  type: 'donation' | 'claim' | 'pickup' | 'delivery' | 'system' | 'urgent';
  relatedDonationId?: string;
}

export interface AIQualityAnalysis {
  freshnessPercentage: number;
  quality: 'Fresh' | 'Medium' | 'Unsafe';
  priorityScore: number;
  shelfLifeEstimateHours: number;
  recommendation: string;
  analysisDetails: string[];
}

export interface AIMatchRecommendation {
  bestNgo: {
    id: string;
    name: string;
    distanceKm: number;
    capacityMatches: boolean;
  };
  bestVolunteer: {
    id: string;
    name: string;
    distanceKm: number;
    rating: number;
  };
  matchScore: number;
  reasoning: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
