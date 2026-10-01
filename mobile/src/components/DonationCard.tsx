import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Donation, UserRole } from '../types';
import { FreshnessGauge } from './FreshnessGauge';

interface Props {
  donation: Donation;
  role: UserRole;
  onClaim?: (donation: Donation) => void;
  onVerifyQr?: (donation: Donation) => void;
  onViewRoute?: (donation: Donation) => void;
}

export const DonationCard: React.FC<Props> = ({
  donation,
  role,
  onClaim,
  onVerifyQr,
  onViewRoute,
}) => {
  const getStatusBadge = () => {
    switch (donation.status) {
      case 'Ready':
        return { bg: '#D1FAE5', text: '#065F46', label: '🟢 Available' };
      case 'Claimed':
        return { bg: '#FEF3C7', text: '#92400E', label: '🟡 Claimed' };
      case 'In Transit':
        return { bg: '#DBEAFE', text: '#1E40AF', label: '🚚 In Transit' };
      default:
        return { bg: '#E5E7EB', text: '#374151', label: donation.status };
    }
  };

  const statusStyle = getStatusBadge();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.infoLeft}>
          <View style={styles.badgeRow}>
            <View style={[styles.statusTag, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusTagText, { color: statusStyle.text }]}>
                {statusStyle.label}
              </Text>
            </View>
            {donation.urgency === 'Urgent' && (
              <View style={styles.urgentTag}>
                <Text style={styles.urgentTagText}>🔥 High Urgency</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{donation.title}</Text>
          <Text style={styles.amount}>📦 {donation.amount}</Text>
          <Text style={styles.location}>📍 {donation.location}</Text>
          <Text style={styles.time}>⏳ {donation.time}</Text>
        </View>

        {donation.freshnessScore !== undefined && (
          <View style={styles.gaugeContainer}>
            <FreshnessGauge score={donation.freshnessScore} quality={donation.qualityRating} />
          </View>
        )}
      </View>

      <View style={styles.actionsDivider} />

      <View style={styles.bottomActions}>
        {role === 'ngo' && donation.status === 'Ready' && onClaim && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.claimBtn]}
            onPress={() => onClaim(donation)}
          >
            <Text style={styles.btnText}>🤝 Claim Donation</Text>
          </TouchableOpacity>
        )}

        {role === 'volunteer' && (
          <>
            {donation.status === 'Claimed' && onClaim && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.acceptPickupBtn]}
                onPress={() => onClaim(donation)}
              >
                <Text style={styles.btnText}>🚴 Accept Pickup</Text>
              </TouchableOpacity>
            )}
            {onVerifyQr && (
              <TouchableOpacity
                style={[styles.actionBtn, styles.qrBtn]}
                onPress={() => onVerifyQr(donation)}
              >
                <Text style={styles.btnText}>📲 Scan QR</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {onViewRoute && (
          <TouchableOpacity
            style={[styles.actionBtn, styles.routeBtn]}
            onPress={() => onViewRoute(donation)}
          >
            <Text style={styles.routeBtnText}>🗺️ Route</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#064E3B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#047857',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoLeft: {
    flex: 1,
    paddingRight: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 6,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  urgentTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  urgentTagText: {
    color: '#991B1B',
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  amount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#34D399',
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#D1FAE5',
    marginBottom: 2,
  },
  time: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  gaugeContainer: {
    marginLeft: 8,
  },
  actionsDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 12,
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  claimBtn: {
    backgroundColor: '#3B82F6',
    flex: 1,
  },
  acceptPickupBtn: {
    backgroundColor: '#F59E0B',
    flex: 1,
  },
  qrBtn: {
    backgroundColor: '#10B981',
  },
  routeBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  routeBtnText: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '600',
  },
});
