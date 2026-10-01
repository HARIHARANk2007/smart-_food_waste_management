import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { User, ChatMessage } from '../types';
import { api } from '../services/api';
import { Header } from '../components/Header';

interface Props {
  user: User;
  onBack: () => void;
}

export const AiAssistantScreen: React.FC<Props> = ({ user, onBack }) => {
  const [lang, setLang] = useState<'en' | 'ta'>('en');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text:
        lang === 'ta'
          ? 'வணக்கம்! நான் EcoResQ AI உதவியாளர். உணவு பாதுகாப்பு, நேர வரம்புகள், அல்லது QR சரிபார்ப்பு பற்றி என்னிடம் கேளுங்கள்.'
          : 'Hello! I am your EcoResQ AI Food Safety & Logistics Assistant. How can I help you ensure safe, zero-waste food rescue today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const replyText = await api.askChatbot(query, lang, user.role);
      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'ai',
        text: 'Sorry, I could not process your query right now. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts =
    lang === 'en'
      ? [
          'What are FSSAI donation guidelines for cooked meals?',
          'How does the volunteer QR handshake work?',
          'What is the maximum room-temp shelf life for biryani?',
        ]
      : [
          'சமைத்த உணவுக்கான FSSAI பாதுகாப்பு விதிகள் என்ன?',
          'QR குறியீடு மூலம் உணவு வாங்குவது எப்படி?',
          'சூடான உணவு எவ்வளவு நேரம் கெடாமல் இருக்கும்?',
        ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Header title="AI SMART FOOD COPILOT" role={user.role} />

      {/* Language Toggle Bar */}
      <View style={styles.langBar}>
        <Text style={styles.langLabel}>Language / மொழி:</Text>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
          onPress={() => setLang('en')}
        >
          <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>
            English
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.langBtn, lang === 'ta' && styles.langBtnActive]}
          onPress={() => setLang('ta')}
        >
          <Text style={[styles.langBtnText, lang === 'ta' && styles.langBtnTextActive]}>
            தமிழ் (Tamil)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Prompts */}
      <View style={styles.quickPromptsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={quickPrompts}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.promptChip} onPress={() => sendMessage(item)}>
              <Text style={styles.promptChipText}>💡 {item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.promptsList}
        />
      </View>

      {/* Messages Feed */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBubble,
              item.sender === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            <Text style={styles.senderHeader}>
              {item.sender === 'user' ? 'You' : '🤖 EcoResQ AI'} • {item.timestamp}
            </Text>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.messagesList}
      />

      {loading && (
        <View style={styles.loadingBar}>
          <ActivityIndicator size="small" color="#10B981" />
          <Text style={styles.loadingText}>AI is formulating response...</Text>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder={lang === 'ta' ? 'கேள்வி கேட்கவும்...' : 'Ask about food safety, QR codes, or routes...'}
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendBtnText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22',
  },
  langBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#064E3B',
    gap: 8,
  },
  langLabel: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: '600',
  },
  langBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  langBtnActive: {
    backgroundColor: '#10B981',
  },
  langBtnText: {
    color: '#D1FAE5',
    fontSize: 11,
  },
  langBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  quickPromptsContainer: {
    backgroundColor: '#047857',
    paddingVertical: 8,
  },
  promptsList: {
    paddingHorizontal: 12,
    gap: 8,
  },
  promptChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  promptChipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#059669',
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#064E3B',
    borderWidth: 1,
    borderColor: '#047857',
    borderBottomLeftRadius: 2,
  },
  senderHeader: {
    fontSize: 10,
    color: '#A7F3D0',
    marginBottom: 4,
    fontWeight: '700',
  },
  messageText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  loadingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  loadingText: {
    color: '#34D399',
    fontSize: 12,
  },
  inputRow: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#064E3B',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#047857',
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
