import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  Donation, 
  VolunteerProfile, 
  UserProfile, 
  NotificationItem 
} from './types';
import { 
  INITIAL_DONATIONS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_USER_PROFILES, 
  INITIAL_NOTIFICATIONS 
} from './data/mockData';
import { HeaderNav } from './components/HeaderNav';
import { RestaurantDashboard } from './components/RestaurantDashboard';
import { NgoDashboard } from './components/NgoDashboard';
import { VolunteerDashboard } from './components/VolunteerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { InteractiveMap } from './components/InteractiveMap';
import { AnalyticsView } from './components/AnalyticsView';
import { FoodDonationModal } from './components/FoodDonationModal';
import { AiChatbotModal } from './components/AiChatbotModal';
import { QrVerificationModal } from './components/QrVerificationModal';
import { NotificationDrawer } from './components/NotificationDrawer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('restaurant');
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'analytics'>('dashboard');

  const [donations, setDonations] = useState<Donation[]>(INITIAL_DONATIONS);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>(INITIAL_VOLUNTEERS);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>(INITIAL_USER_PROFILES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrTargetDonation, setQrTargetDonation] = useState<Donation | null>(null);
  const [selectedMapDonationId, setSelectedMapDonationId] = useState<string | undefined>(undefined);

  // Apply dark mode class to HTML root element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle Add New Food Donation
  const handleCreateDonation = (newDonationData: Partial<Donation>) => {
    const fullDonation: Donation = {
      id: `don_${Date.now()}`,
      restaurantId: newDonationData.restaurantId || 'rest_001',
      restaurantName: newDonationData.restaurantName || 'Grand Spice Hotel & Catering',
      restaurantPhone: newDonationData.restaurantPhone || '+91 98401 12345',
      foodName: newDonationData.foodName || 'Surplus Meals',
      foodCategory: newDonationData.foodCategory || 'Cooked Meals',
      quantity: newDonationData.quantity || '40 Meals',
      quantityKg: newDonationData.quantityKg || 12,
      description: newDonationData.description || 'Hygienically stored surplus meals',
      storageTemp: newDonationData.storageTemp || 'Hot',
      cookedTime: newDonationData.cookedTime || '1 hour ago',
      expiryTime: newDonationData.expiryTime || new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      pickupTime: newDonationData.pickupTime || 'Immediate',
      location: newDonationData.location || { lat: 13.0604, lng: 80.2496, address: '124 Anna Salai, Chennai' },
      image: newDonationData.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      status: 'available',
      createdAt: new Date().toISOString(),
      aiQualityScore: newDonationData.aiQualityScore || 94,
      aiQualityLabel: newDonationData.aiQualityLabel || 'Fresh',
      aiRecommendation: newDonationData.aiRecommendation || 'Safe for immediate dinner distribution.',
      priorityScore: newDonationData.priorityScore || 85,
      isUrgent: newDonationData.isUrgent || false,
      qrCode: `QR_${Date.now()}`
    };

    setDonations(prev => [fullDonation, ...prev]);

    // Push alert to NGOs
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      receiverRole: 'ngo',
      title: '🚨 New Food Rescue Alert!',
      message: `${fullDonation.restaurantName} uploaded ${fullDonation.foodName} (${fullDonation.quantity}). Ready for claim!`,
      status: 'unread',
      createdAt: new Date().toISOString(),
      type: fullDonation.isUrgent ? 'urgent' : 'donation',
      relatedDonationId: fullDonation.id
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  // Handle NGO Claim Food Action
  const handleClaimDonation = (donationId: string) => {
    setDonations(prev => prev.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'claimed',
          claimedByNgoId: 'ngo_001',
          claimedByNgoName: 'Annam Hunger Relief Foundation',
          assignedVolunteerId: 'vol_001',
          assignedVolunteerName: 'Ramesh Kumar'
        };
      }
      return d;
    }));

    // Trigger alert to volunteer
    const volNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      receiverRole: 'volunteer',
      title: '📦 New Delivery Mission Assigned',
      message: 'You have been assigned to pick up food from Grand Spice Hotel for Annam Relief Foundation.',
      status: 'unread',
      createdAt: new Date().toISOString(),
      type: 'claim',
      relatedDonationId: donationId
    };

    setNotifications(prev => [volNotif, ...prev]);
  };

  // Handle Volunteer Delivery Confirmation
  const handleConfirmDelivery = (donationId: string) => {
    setDonations(prev => prev.map(d => {
      if (d.id === donationId) {
        return {
          ...d,
          status: 'delivered'
        };
      }
      return d;
    }));

    // Reward points to Ramesh Kumar
    setVolunteers(prev => prev.map(v => {
      if (v.id === 'vol_001') {
        return {
          ...v,
          completedDeliveries: v.completedDeliveries + 1,
          rewardPoints: v.rewardPoints + 50
        };
      }
      return v;
    }));

    // Alert restaurant & NGO
    const completeNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      receiverRole: 'all',
      title: '🎉 Delivery Successfully Verified!',
      message: 'Food handover verified with QR code. +50 Eco Reward points awarded to volunteer!',
      status: 'unread',
      createdAt: new Date().toISOString(),
      type: 'delivery',
      relatedDonationId: donationId
    };

    setNotifications(prev => [completeNotif, ...prev]);
  };

  // Handle Admin User Approval
  const handleApproveUser = (userId: string) => {
    setUserProfiles(prev => prev.map(u => u.id === userId ? { ...u, isApproved: true } : u));
  };

  const unreadNotifCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className={`min-h-screen transition-colors font-sans antialiased ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      
      {/* Header & Role Navigation Bar */}
      <HeaderNav
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        language={language}
        onLanguageToggle={() => setLanguage(prev => prev === 'en' ? 'ta' : 'en')}
        isDarkMode={isDarkMode}
        onDarkModeToggle={() => setIsDarkMode(prev => !prev)}
        unreadCount={unreadNotifCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenDonationModal={() => setIsDonationModalOpen(true)}
        onOpenChatbot={() => setIsChatbotOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* If Map Tab is explicitly selected */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            <InteractiveMap
              donations={donations}
              volunteers={volunteers}
              userProfiles={userProfiles}
              selectedDonationId={selectedMapDonationId}
              onSelectDonation={setSelectedMapDonationId}
              isDarkMode={isDarkMode}
            />
          </div>
        )}

        {/* If Analytics Tab is explicitly selected */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            donations={donations}
            language={language}
            isDarkMode={isDarkMode}
          />
        )}

        {/* If Dashboard Tab is selected -> Display specific User Role Dashboard */}
        {activeTab === 'dashboard' && (
          <>
            {currentRole === 'restaurant' && (
              <RestaurantDashboard
                donations={donations}
                onOpenDonationModal={() => setIsDonationModalOpen(true)}
                onSelectDonation={(id) => {
                  setSelectedMapDonationId(id);
                  setActiveTab('map');
                }}
                onOpenQrModal={(don) => {
                  setQrTargetDonation(don);
                  setIsQrModalOpen(true);
                }}
                language={language}
                isDarkMode={isDarkMode}
              />
            )}

            {currentRole === 'ngo' && (
              <NgoDashboard
                donations={donations}
                onClaimDonation={handleClaimDonation}
                onSelectDonation={(id) => {
                  setSelectedMapDonationId(id);
                  setActiveTab('map');
                }}
                language={language}
                isDarkMode={isDarkMode}
              />
            )}

            {currentRole === 'volunteer' && (
              <VolunteerDashboard
                volunteers={volunteers}
                donations={donations}
                onOpenQrModal={(don) => {
                  setQrTargetDonation(don);
                  setIsQrModalOpen(true);
                }}
                onSelectDonation={(id) => {
                  setSelectedMapDonationId(id);
                  setActiveTab('map');
                }}
                onConfirmDelivery={handleConfirmDelivery}
                language={language}
                isDarkMode={isDarkMode}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                userProfiles={userProfiles}
                donations={donations}
                onApproveUser={handleApproveUser}
                language={language}
                isDarkMode={isDarkMode}
              />
            )}
          </>
        )}

      </main>

      {/* Floating Modals */}
      <FoodDonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
        onSubmitDonation={handleCreateDonation}
        language={language}
        isDarkMode={isDarkMode}
      />

      <AiChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        language={language}
        currentRole={currentRole}
        isDarkMode={isDarkMode}
      />

      <QrVerificationModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        donation={qrTargetDonation}
        isDarkMode={isDarkMode}
      />

      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })))}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
