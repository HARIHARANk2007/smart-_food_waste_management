import { Language } from '../types';

export const translations = {
  en: {
    appName: "EcoResQ",
    tagline: "AI-Powered Food Rescue Network",
    roleRestaurant: "Restaurant / Hotel",
    roleNgo: "NGO / Shelter",
    roleVolunteer: "Volunteer",
    roleAdmin: "Admin Console",
    
    // Common Navigation & Actions
    dashboard: "Dashboard",
    donations: "Donations",
    liveMap: "Live Map",
    analytics: "AI Analytics",
    chatbot: "AI Assistant",
    notifications: "Notifications",
    settings: "Settings",
    newDonation: "+ Donate Food",
    urgentAlert: "URGENT RESCUE MODE",
    filterDistance: "Filter Distance",
    filterCategory: "Filter Category",
    searchPlaceholder: "Search food items, NGOs, location...",
    
    // Status Labels
    statusAvailable: "Available for Pickup",
    statusClaimed: "Claimed by NGO",
    statusInTransit: "In Transit",
    statusDelivered: "Delivered & Verified",
    statusExpired: "Expired / Unsafe",
    
    // Restaurant Screen
    restHeaderTitle: "Restaurant Food Management",
    restHeaderSub: "Manage surplus food, AI quality analysis & pickup tracking",
    statFoodSaved: "Food Saved",
    statMealsServed: "Meals Served",
    statCo2Saved: "CO₂ Emissions Reduced",
    statActiveDonations: "Active Donations",
    activeDonationsTitle: "Your Live Donations",
    recentDonationHistory: "Recent Donation History",
    
    // NGO Screen
    ngoHeaderTitle: "NGO Food Claim Center",
    ngoHeaderSub: "Find nearby surplus meals, claim instantly & track deliveries",
    nearbyDonations: "Nearby Food Donations",
    claimFoodBtn: "Claim Food Donation",
    trackingDelivery: "Live Delivery Tracker",
    eta: "Estimated Arrival",
    assignedVolunteer: "Assigned Volunteer",
    
    // Volunteer Screen
    volHeaderTitle: "Volunteer Mission Portal",
    volHeaderSub: "Pick up donations, navigate with GPS & earn reward points",
    assignedTasks: "My Active Pickups",
    startPickup: "Start Pickup Mission",
    confirmPickup: "Confirm Pickup (Scan QR)",
    confirmDelivery: "Confirm Delivery & Proof",
    rewardPoints: "Reward Points",
    volunteerRank: "Volunteer Rank",
    leaderboardTitle: "Top Volunteers Leaderboard",
    
    // Admin Screen
    adminHeaderTitle: "System Administration & AI Oversight",
    adminHeaderSub: "Monitor regional food pipeline, user verification & AI fraud detection",
    pendingApprovals: "Pending User Approvals",
    aiFraudDetection: "AI Quality & Anomaly Detection Alerts",
    heatMapTitle: "Regional Rescue Density Heatmap",
    
    // AI Chatbot & Modal
    aiFreshnessPredictor: "AI Freshness & Safety Analysis",
    predictFreshnessBtn: "Scan Freshness with Gemini AI",
    freshnessScore: "Freshness Score",
    priorityScore: "Priority Score",
    aiRecommendation: "AI Recommendation",
    chatbotTitle: "EcoResQ AI Safety & Rescue Assistant",
    chatPromptPlaceholder: "Ask about food safety, pickup rules, Tamil guidelines...",
    
    // Dialog / Modal
    foodName: "Food Item Name",
    category: "Food Category",
    quantity: "Quantity (Meals / kg)",
    storageTemp: "Storage Temperature",
    expiryInHours: "Expiry Window (Hours)",
    pickupAddress: "Pickup Address",
    uploadFoodPhoto: "Upload Food Image",
    submitDonation: "Publish Donation Alert",
    verifyQr: "Verify QR Handover",
    
    // Footer / Misc
    langToggle: "தமிழ்",
    lightMode: "Light Mode",
    darkMode: "Dark Mode"
  },
  
  ta: {
    appName: "எக்கோரெஸ்க்கியூ (EcoResQ)",
    tagline: "செயற்கை நுண்ணறிவு உணவு மீட்பு நெட்வொர்க்",
    roleRestaurant: "உணவகம் / ஹோட்டல்",
    roleNgo: "தண்டு / தொண்டு நிறுவனம்",
    roleVolunteer: "தன்னார்வலர் (Volunteer)",
    roleAdmin: "நிர்வாகக் குழு (Admin)",
    
    // Common Navigation & Actions
    dashboard: "டாஷ்போர்டு",
    donations: "உணவு நன்கொடைகள்",
    liveMap: "நேரலை வரைபடம்",
    analytics: "AI பகுப்பாய்வு",
    chatbot: "AI உதவி மையம்",
    notifications: "அறிவிப்புகள்",
    settings: "அமைப்புகள்",
    newDonation: "+ உணவு வழங்குக",
    urgentAlert: "அவசர உணவு மீட்பு முறை",
    filterDistance: "தூரம் வடிகட்டி",
    filterCategory: "பிரிவு வடிகட்டி",
    searchPlaceholder: "உணவு, தொண்டு நிறுவனம், இடத்தை தேடுக...",
    
    // Status Labels
    statusAvailable: "எடுக்க தயார்",
    statusClaimed: "கோரப்பட்டது",
    statusInTransit: "வழிப்பயணத்தில் உள்ளது",
    statusDelivered: "விநியோகிக்கப்பட்டது",
    statusExpired: "காலாவதியானது",
    
    // Restaurant Screen
    restHeaderTitle: "உணவக உணவு மேலாண்மை",
    restHeaderSub: "மீதமுள்ள உணவை நிர்வகித்து, AI தரம் சோதனை செய்து பகிருங்கள்",
    statFoodSaved: "சேமிக்கப்பட்ட உணவு",
    statMealsServed: "வழங்கப்பட்ட உணவுகள்",
    statCo2Saved: "குறைக்கப்பட்ட கரி உமிழ்வு (CO₂)",
    statActiveDonations: "செயலில் உள்ள நன்கொடைகள்",
    activeDonationsTitle: "உங்கள் தற்போதைய நன்கொடைகள்",
    recentDonationHistory: "சமீபத்திய வரலாற்று பதிவு",
    
    // NGO Screen
    ngoHeaderTitle: "தொண்டு நிறுவன உணவு மையம்",
    ngoHeaderSub: "அருகிலுள்ள உணவைக் கோரி, நேரலையில் கண்காணிக்கவும்",
    nearbyDonations: "அருகிலுள்ள உணவு நன்கொடைகள்",
    claimFoodBtn: "உணவைக் கோருங்கள்",
    trackingDelivery: "நேரலை விநியோக கண்காணிப்பு",
    eta: "எதிர்பார்க்கப்படும் வருகை நேரம்",
    assignedVolunteer: "ஒதுக்கப்பட்ட தன்னார்வலர்",
    
    // Volunteer Screen
    volHeaderTitle: "தன்னார்வலர் பணி போர்ட்டல்",
    volHeaderSub: "உணவை எடுத்துச் சென்று விநியோகித்து புள்ளிகளைப் பெறுங்கள்",
    assignedTasks: "எனது பணிகள்",
    startPickup: "பயணத்தைத் தொடங்கு",
    confirmPickup: "எடுத்ததை உறுதிசெய் (QR ஸ்கேன்)",
    confirmDelivery: "விநியோகத்தை உறுதிசெய்",
    rewardPoints: "வெற்றிப் புள்ளிகள்",
    volunteerRank: "தன்னார்வலர் நிலை",
    leaderboardTitle: "சிறந்த தன்னார்வலர்கள் தரவரிசை",
    
    // Admin Screen
    adminHeaderTitle: "நிர்வாகி மற்றும் AI கண்காணிப்பு",
    adminHeaderSub: "அமைப்பின் உணவு ஓட்டம் மற்றும் பயனர்களைக் கண்காணிக்கவும்",
    pendingApprovals: "ஒப்புதலுக்கு காத்திருக்கும் பயனர்கள்",
    aiFraudDetection: "AI மோசடி எச்சரிக்கைகள்",
    heatMapTitle: "பிராந்திய உணவு மீட்பு வரைபடம்",
    
    // AI Chatbot & Modal
    aiFreshnessPredictor: "AI உணவு புதியதன்மை சோதனை",
    predictFreshnessBtn: "Gemini AI மூலம் புதுமை சோதிக்க",
    freshnessScore: "புதுமை சதவீதம்",
    priorityScore: "முன்னுரிமை புள்ளி",
    aiRecommendation: "AI பரிந்துரை",
    chatbotTitle: "EcoResQ AI உணவு உதவி மையம்",
    chatPromptPlaceholder: "உணவு பாதுகாப்பு, விதிகள் பற்றி கேட்கவும்...",
    
    // Dialog / Modal
    foodName: "உணவின் பெயர்",
    category: "உணவுப் பிரிவு",
    quantity: "அளவு (உணவுகள் / கிலோ)",
    storageTemp: "சேமிப்பு வெப்பநிலை",
    expiryInHours: "காலாவதி நேரம் (மணிநேரம்)",
    pickupAddress: "எடுக்கும் முகவரி",
    uploadFoodPhoto: "உணவு படம் பதிவேற்றுக",
    submitDonation: "நன்கொடை அறிவிப்பை வெளியிடுக",
    verifyQr: "QR சரிபார்ப்பு",
    
    // Footer / Misc
    langToggle: "English",
    lightMode: "பகல் பயன்முறை",
    darkMode: "இரவு பயன்முறை"
  }
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
