import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { User, AiQualityPrediction } from '../types';
import { api } from '../services/api';
import { Header } from '../components/Header';
import { FreshnessGauge } from '../components/FreshnessGauge';

interface Props {
  user: User;
  onSuccess: () => void;
  onBack: () => void;
}

export const DonateScreen: React.FC<Props> = ({ user, onSuccess, onBack }) => {
  const [foodTitle, setFoodTitle] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('Anna Salai, Chennai');
  const [category, setCategory] = useState('Cooked Meals');
  const [storageTemp, setStorageTemp] = useState('Room Temp (25°C)');
  const [hoursAgo, setHoursAgo] = useState('2');
  
  // Image & Camera State
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<AiQualityPrediction | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Take photo with device camera
  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required to capture food photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        const formattedBase64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null;
        setImageBase64(formattedBase64);

        // Auto-suggest running AI check if title is already entered
        if (foodTitle) {
          runAiQualityCheck(formattedBase64 || undefined);
        }
      }
    } catch (err: any) {
      Alert.alert('Camera Error', err.message || 'Failed to capture photo.');
    }
  };

  // Choose photo from library
  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Photo gallery permission is required to select food images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        const formattedBase64 = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null;
        setImageBase64(formattedBase64);

        if (foodTitle) {
          runAiQualityCheck(formattedBase64 || undefined);
        }
      }
    } catch (err: any) {
      Alert.alert('Gallery Error', err.message || 'Failed to pick image.');
    }
  };

  const removePhoto = () => {
    setImageUri(null);
    setImageBase64(null);
  };

  const runAiQualityCheck = async (customBase64?: string) => {
    if (!foodTitle) {
      Alert.alert('Missing Food Name', 'Please enter a food title or item description before running AI inspection.');
      return;
    }
    setAnalyzingAi(true);
    try {
      const res = await api.predictQuality({
        foodName: foodTitle,
        foodCategory: category,
        storageTemp,
        cookedHoursAgo: Number(hoursAgo) || 2,
        imageBase64: customBase64 || imageBase64 || undefined,
      });
      if (res.success && res.data) {
        setAiPrediction(res.data);
      }
    } catch (err: any) {
      Alert.alert('AI Error', 'Failed to inspect food quality: ' + err.message);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleSubmit = async () => {
    if (!foodTitle || !quantity || !location) {
      Alert.alert('Required Fields', 'Please fill in food title, quantity, and pickup location.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createDonation({
        title: foodTitle,
        amount: quantity,
        location,
        foodCategory: category,
        storageTemp,
        cookedHoursAgo: Number(hoursAgo) || 2,
        freshnessScore: aiPrediction?.freshnessPercentage || 92,
        imageBase64: imageBase64 || undefined,
      });

      if (res.success) {
        Alert.alert('Donation Broadcasted! 🚀', 'Local NGOs and Volunteers have been notified for pickup matching.', [
          { text: 'View Feed', onPress: onSuccess },
        ]);
      }
    } catch (err: any) {
      Alert.alert('Submission Error', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="NEW DONATION" role={user.role} />

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>🍲 Food Donation Details</Text>

          {/* Camera / Image Upload Section */}
          <Text style={styles.label}>📷 Food Photo (for AI Vision Inspection)</Text>
          {imageUri ? (
            <View style={styles.photoPreviewCard}>
              <Image source={{ uri: imageUri }} style={styles.photoPreview} />
              <View style={styles.photoOverlayBadge}>
                <Text style={styles.photoOverlayText}>📸 Image Attached</Text>
              </View>
              <View style={styles.photoActionsRow}>
                <TouchableOpacity style={styles.retakeBtn} onPress={handleTakePhoto}>
                  <Text style={styles.retakeBtnText}>🔄 Retake Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.removePhotoBtn} onPress={removePhoto}>
                  <Text style={styles.removePhotoBtnText}>🗑️ Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.cameraPickerRow}>
              <TouchableOpacity style={styles.cameraBtn} onPress={handleTakePhoto}>
                <Text style={styles.cameraBtnEmoji}>📸</Text>
                <Text style={styles.cameraBtnText}>Take Photo</Text>
                <Text style={styles.cameraBtnSub}>Use live camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.galleryBtn} onPress={handlePickFromGallery}>
                <Text style={styles.cameraBtnEmoji}>🖼️</Text>
                <Text style={styles.cameraBtnText}>Photo Gallery</Text>
                <Text style={styles.cameraBtnSub}>Upload existing</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.label}>Food Name / Item Description</Text>
          <TextInput
            style={styles.input}
            value={foodTitle}
            onChangeText={setFoodTitle}
            placeholder="e.g. 50 Packets Vegetable Biryani & Kurma"
            placeholderTextColor="#9CA3AF"
          />

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Quantity / Servings</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="e.g. 45 Meals"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Prepared (Hours Ago)</Text>
              <TextInput
                style={styles.input}
                value={hoursAgo}
                onChangeText={setHoursAgo}
                keyboardType="numeric"
                placeholder="e.g. 2"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <Text style={styles.label}>Food Category</Text>
          <View style={styles.chipRow}>
            {['Cooked Meals', 'Bakery / Bread', 'Packaged Snacks', 'Raw Produce'].map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, category === cat && styles.chipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.chipText, category === cat && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Storage & Temperature</Text>
          <View style={styles.chipRow}>
            {['Hot Insulated (>60°C)', 'Room Temp (25°C)', 'Chilled (<5°C)'].map((temp) => (
              <TouchableOpacity
                key={temp}
                style={[styles.chip, storageTemp === temp && styles.chipActive]}
                onPress={() => setStorageTemp(temp)}
              >
                <Text style={[styles.chipText, storageTemp === temp && styles.chipTextActive]}>
                  {temp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Pickup Location Address</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. 104 Anna Salai, Chennai"
            placeholderTextColor="#9CA3AF"
          />

          {/* AI Quality Inspection Trigger */}
          <TouchableOpacity
            style={styles.aiInspectButton}
            onPress={() => runAiQualityCheck()}
            disabled={analyzingAi}
          >
            {analyzingAi ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.aiInspectButtonText}>
                ✨ {imageBase64 ? 'Analyze Photo with AI Vision' : 'Run AI Freshness & HACCP Check'}
              </Text>
            )}
          </TouchableOpacity>

          {/* AI Inspection Results */}
          {aiPrediction && (
            <View style={styles.aiResultCard}>
              <View style={styles.aiResultTop}>
                <FreshnessGauge
                  score={aiPrediction.freshnessPercentage}
                  quality={aiPrediction.quality}
                />
                <View style={styles.aiResultSummary}>
                  <Text style={styles.aiResultTitle}>AI Safety Assessment</Text>
                  <Text style={styles.aiShelfLife}>
                    ⏳ Safe Window: {aiPrediction.shelfLifeEstimateHours} hours
                  </Text>
                  <Text style={styles.aiRecommendation}>{aiPrediction.recommendation}</Text>
                </View>
              </View>

              <View style={styles.analysisPoints}>
                {aiPrediction.analysisDetails.map((pt, idx) => (
                  <Text key={idx} style={styles.analysisBullet}>
                    • {pt}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>🚀 Broadcast Food Donation</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelBtn} onPress={onBack}>
            <Text style={styles.cancelBtnText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
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
  card: {
    backgroundColor: '#064E3B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#047857',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1FAE5',
    marginBottom: 6,
  },
  cameraPickerRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  cameraBtn: {
    flex: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  galleryBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
  },
  cameraBtnEmoji: {
    fontSize: 26,
    marginBottom: 4,
  },
  cameraBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  cameraBtnSub: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 2,
  },
  photoPreviewCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 14,
    padding: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  photoOverlayBadge: {
    position: 'absolute',
    top: 18,
    left: 18,
    backgroundColor: 'rgba(6, 78, 59, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  photoOverlayText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  photoActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  retakeBtn: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  retakeBtnText: {
    color: '#D1FAE5',
    fontSize: 12,
    fontWeight: '600',
  },
  removePhotoBtn: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  removePhotoBtnText: {
    color: '#FCA5A5',
    fontSize: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: '#047857',
    borderColor: '#34D399',
  },
  chipText: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  aiInspectButton: {
    backgroundColor: '#4338CA',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  aiInspectButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  aiResultCard: {
    backgroundColor: '#022C22',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  aiResultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  aiResultSummary: {
    flex: 1,
  },
  aiResultTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  aiShelfLife: {
    fontSize: 12,
    color: '#FBBF24',
    fontWeight: '600',
    marginVertical: 2,
  },
  aiRecommendation: {
    fontSize: 11,
    color: '#D1FAE5',
    lineHeight: 15,
  },
  analysisPoints: {
    marginTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 8,
  },
  analysisBullet: {
    fontSize: 11,
    color: '#A7F3D0',
    marginBottom: 3,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    alignItems: 'center',
    marginTop: 14,
  },
  cancelBtnText: {
    color: '#9CA3AF',
    fontSize: 13,
  },
});
