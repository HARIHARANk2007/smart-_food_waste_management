import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface Props {
  onLoginSuccess: (user: User) => void;
}

export const AuthScreen: React.FC<Props> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('restaurant@ecoresq.demo');
  const [password, setPassword] = useState('demo123');
  const [selectedRole, setSelectedRole] = useState<UserRole>('restaurant');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.success && res.user) {
        onLoginSuccess({ ...res.user, role: selectedRole });
      } else {
        Alert.alert('Login Failed', 'Invalid email or password.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Login connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const selectPreset = (role: UserRole, defaultEmail: string) => {
    setSelectedRole(role);
    setEmail(defaultEmail);
    setPassword('demo123');
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerBox}>
        <Text style={styles.appTitle}>Eco<Text style={styles.appHighlight}>ResQ</Text></Text>
        <Text style={styles.tagline}>Sign in to start rescuing or claiming surplus food</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Select Your Role</Text>
        <View style={styles.roleGrid}>
          {[
            { role: 'restaurant', label: '🍲 Restaurant', email: 'restaurant@ecoresq.demo' },
            { role: 'ngo', label: '🤝 NGO / Shelter', email: 'ngo@ecoresq.demo' },
            { role: 'volunteer', label: '🚴 Volunteer', email: 'volunteer@ecoresq.demo' },
            { role: 'admin', label: '🛡️ Admin', email: 'admin@ecoresq.demo' },
          ].map((item) => {
            const isSelected = selectedRole === item.role;
            return (
              <TouchableOpacity
                key={item.role}
                style={[styles.roleButton, isSelected && styles.roleButtonActive]}
                onPress={() => selectPreset(item.role as UserRole, item.email)}
              >
                <Text style={[styles.roleText, isSelected && styles.roleTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.inputLabel}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="e.g. restaurant@ecoresq.demo"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Sign In as {selectedRole.toUpperCase()}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.badgeFooter}>
          <Text style={styles.badgeFooterText}>🔒 Secured with AI Quality Verification & FSSAI Standards</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#064E3B',
    padding: 20,
    justifyContent: 'center',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  appHighlight: {
    color: '#34D399',
  },
  tagline: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 6,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#065F46',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#047857',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#A7F3D0',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  roleButton: {
    flexBasis: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roleButtonActive: {
    backgroundColor: '#047857',
    borderColor: '#34D399',
  },
  roleText: {
    color: '#D1FAE5',
    fontSize: 13,
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1FAE5',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loginButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  badgeFooter: {
    marginTop: 20,
    alignItems: 'center',
  },
  badgeFooterText: {
    color: '#6EE7B7',
    fontSize: 11,
    textAlign: 'center',
  },
});
