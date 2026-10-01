import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  score: number;
  quality?: 'Fresh' | 'Medium' | 'Unsafe';
}

export const FreshnessGauge: React.FC<Props> = ({ score, quality = 'Fresh' }) => {
  const getColor = () => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const color = getColor();

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.scoreText, { color }]}>{score}%</Text>
        <Text style={styles.label}>Freshness</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{quality.toUpperCase()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#064E3B',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '800',
  },
  label: {
    fontSize: 8,
    color: '#A7F3D0',
    fontWeight: '600',
    marginTop: -2,
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
});
