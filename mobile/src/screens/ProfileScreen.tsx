import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { User, UserRole } from '../types';
import { Header } from '../components/Header';

interface Props {
  user: User;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ user, onRoleSwitch, onLogout }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);
  const [gpsPrecision, setGpsPrecision] = useState(true);

  return (
    <View style={styles.container}>
      <Header title="ACCOUNT & SETTINGS" role={user.role} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>
              {user.role === 'restaurant'
                ? '🍲'
                : user.role === 'ngo'
                ? '🤝'
                : user.role === 'volunteer'
                ? '🚴'
                : '🛡️'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>✅ FSSAI & ISO Certified Partner</Text>
            </View>
          </View>
        </View>

        {/* Role Switcher */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Switch Active Role</Text>
          <View style={styles.roleGrid}>
            {(['restaurant', 'ngo', 'volunteer', 'admin'] as UserRole[]).map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleBtn, user.role === r && styles.roleBtnActive]}
                onPress={() => onRoleSwitch(r)}
              >
                <Text style={[styles.roleBtnText, user.role === r && styles.roleBtnTextActive]}>
                  {r.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Text style={styles.toggleSub}>Instant alerts for urgent food expiry & pickups</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor="#10B981"
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>Offline Queue & Sync</Text>
              <Text style={styles.toggleSub}>Save QR verification scans without mobile internet</Text>
            </View>
            <Switch
              value={offlineSyncEnabled}
              onValueChange={setOfflineSyncEnabled}
              thumbColor="#10B981"
            />
          </View>

          <View style={styles.toggleRow}>
            <View>
              <Text style={styles.toggleLabel}>High Precision GPS Tracking</Text>
              <Text style={styles.toggleSub}>Real-time route optimization for volunteers</Text>
            </View>
            <Switch
              value={gpsPrecision}
              onValueChange={setGpsPrecision}
              thumbColor="#10B981"
            />
          </View>
        </View>

        {/* Safety & Compliance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Compliance</Text>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('HACCP Safety Policy', 'EcoResQ enforces temperature threshold guidelines, mandatory 4-hour hot-chain transit, and contactless QR handshakes.')}
          >
            <Text style={styles.menuItemText}>📜 Food Safety & HACCP Protocol</Text>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert('FSSAI Guidelines', 'Compliant with Indian Food Safety and Standards (Recovery & Distribution of Surplus Food) Regulations.')}
          >
            <Text style={styles.menuItemText}>🏛️ FSSAI Surplus Food Guidelines</Text>
            <Text style={styles.arrowText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Sign Out of EcoResQ</Text>
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#064E3B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#047857',
    marginBottom: 16,
    gap: 14,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userEmail: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  badgeText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    backgroundColor: '#064E3B',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#047857',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A7F3D0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  roleGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    alignItems: 'center',
  },
  roleBtnActive: {
    backgroundColor: '#10B981',
  },
  roleBtnText: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '700',
  },
  roleBtnTextActive: {
    color: '#FFFFFF',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  toggleSub: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 2,
    maxWidth: 220,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '500',
  },
  arrowText: {
    color: '#9CA3AF',
    fontSize: 18,
  },
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  logoutBtnText: {
    color: '#F87171',
    fontSize: 14,
    fontWeight: '700',
  },
});
