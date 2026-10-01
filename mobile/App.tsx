import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { User, Donation, UserRole } from './src/types';
import { SplashScreen } from './src/screens/SplashScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { DonateScreen } from './src/screens/DonateScreen';
import { MapScreen } from './src/screens/MapScreen';
import { QrScannerScreen } from './src/screens/QrScannerScreen';
import { AiAssistantScreen } from './src/screens/AiAssistantScreen';
import { AnalyticsScreen } from './src/screens/AnalyticsScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';

type ScreenTab = 'home' | 'donate' | 'map' | 'ai' | 'analytics' | 'profile' | 'qr';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<ScreenTab>('home');
  const [selectedDonation, setSelectedDonation] = useState<Donation | undefined>(undefined);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!currentUser) {
    return <AuthScreen onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const handleRoleSwitch = (newRole: UserRole) => {
    setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
  };

  const handleOpenQr = (donation?: Donation) => {
    setSelectedDonation(donation);
    setCurrentTab('qr');
  };

  const handleOpenMap = (donation?: Donation) => {
    setSelectedDonation(donation);
    setCurrentTab('map');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#022C22" />
      <View style={styles.screenContainer}>
        {currentTab === 'home' && (
          <HomeScreen
            user={currentUser}
            onNavigateToDonate={() => setCurrentTab('donate')}
            onNavigateToQr={handleOpenQr}
            onNavigateToMap={handleOpenMap}
            onNavigateToAiChat={() => setCurrentTab('ai')}
          />
        )}

        {currentTab === 'donate' && (
          <DonateScreen
            user={currentUser}
            onSuccess={() => setCurrentTab('home')}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'map' && (
          <MapScreen
            user={currentUser}
            activeDonation={selectedDonation}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'qr' && (
          <QrScannerScreen
            user={currentUser}
            activeDonation={selectedDonation}
            onScanComplete={() => setCurrentTab('home')}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'ai' && (
          <AiAssistantScreen
            user={currentUser}
            onBack={() => setCurrentTab('home')}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsScreen user={currentUser} />
        )}

        {currentTab === 'profile' && (
          <ProfileScreen
            user={currentUser}
            onRoleSwitch={handleRoleSwitch}
            onLogout={() => setCurrentUser(null)}
          />
        )}
      </View>

      {/* Bottom Mobile Tab Bar */}
      <View style={styles.tabBar}>
        {[
          { tab: 'home', label: 'Feed', emoji: '🏠' },
          ...(currentUser.role === 'restaurant'
            ? [{ tab: 'donate', label: 'Donate', emoji: '🍲' }]
            : []),
          { tab: 'map', label: 'Radar', emoji: '📍' },
          { tab: 'ai', label: 'AI Copilot', emoji: '🤖' },
          { tab: 'analytics', label: 'Impact', emoji: '🌱' },
          { tab: 'profile', label: 'Profile', emoji: '👤' },
        ].map((item) => {
          const isActive = currentTab === item.tab;
          return (
            <TouchableOpacity
              key={item.tab}
              style={styles.tabItem}
              onPress={() => setCurrentTab(item.tab as ScreenTab)}
            >
              <Text style={[styles.tabEmoji, isActive && styles.tabEmojiActive]}>
                {item.emoji}
              </Text>
              <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#064E3B',
    borderTopWidth: 1,
    borderTopColor: '#047857',
    paddingVertical: 8,
    paddingBottom: 12,
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  tabEmoji: {
    fontSize: 18,
    opacity: 0.65,
  },
  tabEmojiActive: {
    opacity: 1,
    transform: [{ scale: 1.15 }],
  },
  tabLabel: {
    color: '#A7F3D0',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#34D399',
    fontWeight: '800',
  },
});
