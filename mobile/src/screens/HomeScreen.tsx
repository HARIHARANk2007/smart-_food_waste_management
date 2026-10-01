import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Donation, User } from '../types';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { DonationCard } from '../components/DonationCard';

interface Props {
  user: User;
  onNavigateToDonate: () => void;
  onNavigateToQr: (donation?: Donation) => void;
  onNavigateToMap: (donation?: Donation) => void;
  onNavigateToAiChat: () => void;
}

export const HomeScreen: React.FC<Props> = ({
  user,
  onNavigateToDonate,
  onNavigateToQr,
  onNavigateToMap,
  onNavigateToAiChat,
}) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ready' | 'transit'>('all');

  const fetchDonations = async () => {
    try {
      const data = await api.getDonations();
      setDonations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonations();
    setRefreshing(false);
  };

  const handleClaim = async (donation: Donation) => {
    try {
      const nextStatus = user.role === 'volunteer' ? 'In Transit' : 'Claimed';
      await api.updateDonationStatus(donation.id, nextStatus);
      Alert.alert('Success!', `Donation has been updated to "${nextStatus}".`);
      fetchDonations();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const filteredDonations = donations.filter((item) => {
    if (filter === 'ready') return item.status === 'Ready';
    if (filter === 'transit') return item.status === 'In Transit';
    return true;
  });

  return (
    <View style={styles.container}>
      <Header
        title={`${user.role.toUpperCase()} HUB`}
        role={user.role}
        onOpenChatbot={onNavigateToAiChat}
        unreadCount={3}
      />

      {/* Hero Stats Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTextCol}>
          <Text style={styles.heroGreeting}>Welcome, {user.name} 👋</Text>
          <Text style={styles.heroSubtitle}>
            {user.role === 'restaurant'
              ? 'List surplus food & let AI inspect freshness'
              : user.role === 'ngo'
              ? 'Claim available meals nearby & feed communities'
              : 'Pickup urgent food packages & complete delivery'}
          </Text>
        </View>

        {user.role === 'restaurant' && (
          <TouchableOpacity style={styles.ctaButton} onPress={onNavigateToDonate}>
            <Text style={styles.ctaButtonText}>+ Donate Food</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterBar}>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'ready', label: '🟢 Available' },
          { key: 'transit', label: '🚚 In Transit' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, filter === tab.key && styles.filterTabActive]}
            onPress={() => setFilter(tab.key as any)}
          >
            <Text style={[styles.filterTabText, filter === tab.key && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Donation Feed */}
      <FlatList
        data={filteredDonations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DonationCard
            donation={item}
            role={user.role}
            onClaim={handleClaim}
            onVerifyQr={() => onNavigateToQr(item)}
            onViewRoute={() => onNavigateToMap(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10B981" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍃</Text>
            <Text style={styles.emptyTitle}>No Donations in this filter</Text>
            <Text style={styles.emptySub}>Pull down to refresh live food rescue feeds.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  heroCard: {
    backgroundColor: '#064E3B',
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#047857',
  },
  heroGreeting: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    color: '#A7F3D0',
    lineHeight: 18,
  },
  heroTextCol: {
    marginBottom: 10,
  },
  ctaButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterTabActive: {
    backgroundColor: '#10B981',
  },
  filterTabText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySub: {
    color: '#A7F3D0',
    fontSize: 13,
    marginTop: 4,
  },
});
