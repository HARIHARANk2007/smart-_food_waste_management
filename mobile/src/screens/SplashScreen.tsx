import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';

interface Props {
  onFinish: () => void;
}

const { width } = Dimensions.get('window');

export const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <View style={styles.glowCircle} />
      
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>🌱 AI FOOD RESCUE NETWORK</Text>
      </View>

      <Text style={styles.logoTitle}>
        Eco<Text style={styles.logoHighlight}>ResQ</Text>
      </Text>
      
      <Text style={styles.subtitle}>
        Real-time Smart Logistics & Zero Food Waste
      </Text>

      <View style={styles.pillsRow}>
        <View style={styles.pill}><Text style={styles.pillText}>⚡ AI Freshness</Text></View>
        <View style={styles.pill}><Text style={styles.pillText}>📍 Live GPS</Text></View>
        <View style={styles.pill}><Text style={styles.pillText}>📲 QR Handshake</Text></View>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Connecting to local rescue network...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  glowCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: '#047857',
    opacity: 0.35,
  },
  badgeContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    marginBottom: 16,
  },
  badgeText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  logoTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  logoHighlight: {
    color: '#34D399',
  },
  subtitle: {
    fontSize: 15,
    color: '#D1FAE5',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    maxWidth: 280,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 40,
  },
  pill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  pillText: {
    color: '#F0FDF4',
    fontSize: 12,
    fontWeight: '600',
  },
  loaderContainer: {
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#A7F3D0',
    fontSize: 13,
  },
});
