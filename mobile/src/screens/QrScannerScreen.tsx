import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { User, Donation } from '../types';
import { Header } from '../components/Header';
import { api } from '../services/api';

interface Props {
  user: User;
  activeDonation?: Donation;
  onScanComplete: () => void;
  onBack: () => void;
}

export const QrScannerScreen: React.FC<Props> = ({
  user,
  activeDonation,
  onScanComplete,
  onBack,
}) => {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const simulateQrScan = async () => {
    setScanning(true);
    setTimeout(async () => {
      setScanning(false);
      const code = `ECORESQ_VERIFY_${activeDonation?.id || 'DON_8849'}_OK`;
      setScannedResult(code);

      if (activeDonation) {
        const nextStatus = activeDonation.status === 'Ready' ? 'Claimed' : 'In Transit';
        await api.updateDonationStatus(activeDonation.id, nextStatus);
      }

      Alert.alert(
        '✅ Handshake Verified!',
        `Pickup verified successfully for: ${activeDonation?.title || 'Surplus Food Batch'}.\n\nFood safety chain-of-custody recorded.`,
        [{ text: 'Done', onPress: onScanComplete }]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Header title="QR HANDSHAKE SCANNER" role={user.role} />

      <View style={styles.content}>
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionTitle}>📲 Scan Donor / Volunteer QR Code</Text>
          <Text style={styles.instructionSub}>
            Align the QR code within the frame to verify handover, track real-time delivery, and lock food safety compliance.
          </Text>
        </View>

        {/* Viewfinder simulation box */}
        <View style={styles.viewfinder}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />

          {scanning ? (
            <View style={styles.scanningOverlay}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={styles.scanningText}>Decoding cryptographic token...</Text>
            </View>
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrEmoji}>📷</Text>
              <Text style={styles.targetText}>Camera Active</Text>
            </View>
          )}
        </View>

        {activeDonation && (
          <View style={styles.targetDonationCard}>
            <Text style={styles.targetDonationLabel}>Active Food Target:</Text>
            <Text style={styles.targetDonationTitle}>{activeDonation.title}</Text>
            <Text style={styles.targetDonationSub}>📍 {activeDonation.location} • 📦 {activeDonation.amount}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.scanButton}
          onPress={simulateQrScan}
          disabled={scanning}
        >
          <Text style={styles.scanButtonText}>
            {scanning ? 'Scanning...' : '⚡ Scan Pickup Code'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Cancel & Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionsBox: {
    backgroundColor: '#064E3B',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#047857',
    marginBottom: 24,
    width: '100%',
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  instructionSub: {
    fontSize: 12,
    color: '#A7F3D0',
    lineHeight: 17,
  },
  viewfinder: {
    width: 240,
    height: 240,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 24,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#10B981',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 16,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 16,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 16,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 16,
  },
  qrPlaceholder: {
    alignItems: 'center',
  },
  qrEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  targetText: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '600',
  },
  scanningOverlay: {
    alignItems: 'center',
  },
  scanningText: {
    color: '#34D399',
    fontSize: 12,
    marginTop: 10,
  },
  targetDonationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  targetDonationLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  targetDonationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  targetDonationSub: {
    fontSize: 12,
    color: '#A7F3D0',
    marginTop: 2,
  },
  scanButton: {
    backgroundColor: '#10B981',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  backButton: {
    marginTop: 14,
    padding: 8,
  },
  backButtonText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});
