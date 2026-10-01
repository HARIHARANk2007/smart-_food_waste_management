import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { UserRole } from '../types';

interface Props {
  title: string;
  role: UserRole;
  onOpenNotifications?: () => void;
  onOpenChatbot?: () => void;
  unreadCount?: number;
}

export const Header: React.FC<Props> = ({
  title,
  role,
  onOpenNotifications,
  onOpenChatbot,
  unreadCount = 2,
}) => {
  const getRoleBadge = () => {
    switch (role) {
      case 'restaurant':
        return { label: '🍲 Donor', color: '#10B981' };
      case 'ngo':
        return { label: '🤝 NGO', color: '#3B82F6' };
      case 'volunteer':
        return { label: '🚴 Volunteer', color: '#F59E0B' };
      case 'admin':
        return { label: '🛡️ Admin', color: '#EC4899' };
    }
  };

  const badge = getRoleBadge();

  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftCol}>
        <Text style={styles.appName}>Eco<Text style={styles.accentText}>ResQ</Text></Text>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.rightCol}>
        <View style={[styles.roleBadge, { backgroundColor: badge.color }]}>
          <Text style={styles.roleText}>{badge.label}</Text>
        </View>

        {onOpenChatbot && (
          <TouchableOpacity style={styles.iconButton} onPress={onOpenChatbot}>
            <Text style={styles.iconEmoji}>🤖</Text>
          </TouchableOpacity>
        )}

        {onOpenNotifications && (
          <TouchableOpacity style={styles.iconButton} onPress={onOpenNotifications}>
            <Text style={styles.iconEmoji}>🔔</Text>
            {unreadCount > 0 && (
              <View style={styles.notificationDot}>
                <Text style={styles.dotText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    backgroundColor: '#064E3B',
    borderBottomWidth: 1,
    borderBottomColor: '#047857',
  },
  leftCol: {
    flexDirection: 'column',
  },
  appName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  accentText: {
    color: '#34D399',
  },
  titleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A7F3D0',
    marginTop: 2,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconEmoji: {
    fontSize: 17,
  },
  notificationDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
});
