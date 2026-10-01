import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { User, Donation } from '../types';
import { Header } from '../components/Header';

interface Props {
  user: User;
  activeDonation?: Donation;
  onBack: () => void;
}

export const MapScreen: React.FC<Props> = ({ user, activeDonation, onBack }) => {
  const [selectedPin, setSelectedPin] = useState<'restaurant' | 'volunteer' | 'ngo'>('volunteer');

  return (
    <View style={styles.container}>
      <Header title="LIVE RESCUE RADAR & GPS" role={user.role} />

      {/* Simulated Map Canvas */}
      <View style={styles.mapCanvas}>
        {/* Map Grid / Roads Simulation */}
        <View style={styles.roadHorizontal} />
        <View style={styles.roadVertical} />

        {/* Pins */}
        <TouchableOpacity
          style={[styles.pin, styles.pinRestaurant]}
          onPress={() => setSelectedPin('restaurant')}
        >
          <Text style={styles.pinIcon}>🍲</Text>
          <Text style={styles.pinLabel}>Donor Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pin, styles.pinVolunteer]}
          onPress={() => setSelectedPin('volunteer')}
        >
          <Text style={styles.pinIcon}>🚴</Text>
          <Text style={styles.pinLabel}>Volunteer (You)</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pin, styles.pinNgo]}
          onPress={() => setSelectedPin('ngo')}
        >
          <Text style={styles.pinIcon}>🤝</Text>
          <Text style={styles.pinLabel}>Shelter Drop</Text>
        </TouchableOpacity>

        {/* Route Line Indicator */}
        <View style={styles.routeTag}>
          <Text style={styles.routeTagText}>⚡ AI Optimal Path: 2.3 km (8 mins via e-bike)</Text>
        </View>
      </View>

      {/* Details Bottom Sheet */}
      <ScrollView style={styles.detailsSheet}>
        <View style={styles.handle} />
        <Text style={styles.sheetTitle}>
          {selectedPin === 'restaurant'
            ? '🍲 Pickup: Green Leaf Kitchen (Anna Salai)'
            : selectedPin === 'volunteer'
            ? '🚴 Active Dispatch: En Route to Donor'
            : '🤝 Destination: Annam Relief Shelter (T Nagar)'}
        </Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>1.4 km</Text>
            <Text style={styles.metricSub}>To Pickup</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>6 mins</Text>
            <Text style={styles.metricSub}>ETA</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricVal}>0.8 kg</Text>
            <Text style={styles.metricSub}>CO₂ Saved</Text>
          </View>
        </View>

        <View style={styles.safetyNotice}>
          <Text style={styles.safetyNoticeTitle}>🌡️ Thermal Safety Monitoring</Text>
          <Text style={styles.safetyNoticeText}>
            Cooked food is currently at safe ambient temperature. Keep delivery window under 45 minutes to retain HACCP grade.
          </Text>
        </View>

        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Close Map Radar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#064E3B',
    position: 'relative',
    overflow: 'hidden',
  },
  roadHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  roadVertical: {
    position: 'absolute',
    left: '45%',
    top: 0,
    bottom: 0,
    width: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    padding: 8,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pinRestaurant: {
    top: '25%',
    left: '20%',
    backgroundColor: '#047857',
  },
  pinVolunteer: {
    top: '48%',
    left: '42%',
    backgroundColor: '#F59E0B',
  },
  pinNgo: {
    top: '68%',
    left: '65%',
    backgroundColor: '#3B82F6',
  },
  pinIcon: {
    fontSize: 22,
  },
  pinLabel: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 2,
  },
  routeTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    backgroundColor: 'rgba(6, 78, 59, 0.92)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  routeTagText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  detailsSheet: {
    backgroundColor: '#064E3B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#047857',
    maxHeight: 280,
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  metricVal: {
    color: '#34D399',
    fontSize: 16,
    fontWeight: '800',
  },
  metricSub: {
    color: '#A7F3D0',
    fontSize: 10,
    marginTop: 2,
  },
  safetyNotice: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    marginBottom: 14,
  },
  safetyNoticeTitle: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  safetyNoticeText: {
    color: '#FEF3C7',
    fontSize: 11,
    lineHeight: 15,
  },
  backBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backBtnText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});
