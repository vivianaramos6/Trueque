import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Message = {
  id: string;
  text: string;
  sent: boolean;
  time: string;
};

const MESSAGES: Message[] = [
  { id: '1', text: 'Hey! Sounds good to me', sent: true, time: '10:32 AM' },
  { id: '2', text: "Great, let's lock it in!", sent: false, time: '10:33 AM' },
  { id: '3', text: 'See you Tuesday!', sent: true, time: '10:34 AM' },
];

export default function ChatScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  return (
    <LinearGradient colors={['#cce0ff', '#faf5ec']} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <View style={styles.avatar}>
              <Text style={styles.initials}>SL</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerName}>Sarah Levinson</Text>
              <Text style={styles.headerSub}>Last seen 30 min ago</Text>
            </View>
            <View style={styles.menuBtn}>
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
              <View style={styles.menuLine} />
            </View>
          </View>

          <View style={styles.headerDivider} />

          {/* Messages area */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Exchange card */}
            <View style={styles.exchangeCard}>
              <View style={styles.pillRow}>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>On-going</Text>
                </View>
              </View>
              <View style={styles.tradeRow}>
                <View style={styles.tradeColLeft}>
                  <Text style={styles.tradeLabel}>You Receive:</Text>
                  <Text style={styles.tradeValue}>Python Tutoring</Text>
                </View>
                <Text style={styles.tradeArrow}>⇄</Text>
                <View style={styles.tradeColRight}>
                  <Text style={styles.tradeLabel}>You Offer:</Text>
                  <Text style={styles.tradeValue}>Guitar Lessons</Text>
                </View>
              </View>
              <View style={styles.viewTradeRow}>
                <Text style={styles.viewTradeText}>View Trade ›</Text>
              </View>
            </View>

            {/* Date separator */}
            <Text style={styles.dateSep}>Today</Text>

            {/* Messages */}
            {MESSAGES.map((msg) => (
              <View
                key={msg.id}
                style={[styles.msgGroup, msg.sent ? styles.msgGroupSent : styles.msgGroupReceived]}
              >
                <View style={msg.sent ? styles.bubbleSent : styles.bubbleReceived}>
                  <Text style={styles.bubbleText}>{msg.text}</Text>
                </View>
                <Text style={[styles.timestamp, msg.sent ? styles.timestampRight : styles.timestampLeft]}>
                  {msg.time}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Input bar */}
          <View style={styles.inputDivider} />
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.plusBtn}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.inputField}
              placeholder="Type a message..."
              placeholderTextColor="#999999"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Text style={styles.sendText}>▶</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  flex: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 34,
    color: '#12213b',
    lineHeight: 38,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4a70c4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12213b',
  },
  headerSub: {
    fontSize: 12,
    color: '#737d8a',
  },
  menuBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 6,
  },
  menuLine: {
    height: 2,
    backgroundColor: '#12213b',
    borderRadius: 2,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#e0ebff',
  },

  // ── Scroll ────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 0,
  },

  // ── Exchange card ─────────────────────────────────────────────────────
  exchangeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  pillRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusPill: {
    backgroundColor: '#57cc78',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  tradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tradeColLeft: {
    flex: 1,
    gap: 2,
  },
  tradeColRight: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  tradeLabel: {
    fontSize: 11,
    color: '#737d8a',
  },
  tradeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12213b',
  },
  tradeArrow: {
    fontSize: 20,
    color: '#0050c8',
    paddingHorizontal: 8,
  },
  viewTradeRow: {
    alignItems: 'flex-end',
  },
  viewTradeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ── Date separator ────────────────────────────────────────────────────
  dateSep: {
    textAlign: 'center',
    fontSize: 11,
    color: '#737d8a',
    marginBottom: 16,
  },

  // ── Messages ──────────────────────────────────────────────────────────
  msgGroup: {
    marginBottom: 14,
  },
  msgGroupSent: {
    alignItems: 'flex-end',
  },
  msgGroupReceived: {
    alignItems: 'flex-start',
  },
  bubbleSent: {
    backgroundColor: '#0050c8',
    borderRadius: 18,
    borderTopRightRadius: 4,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
    maxWidth: 250,
  },
  bubbleReceived: {
    backgroundColor: '#f08c02',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
    maxWidth: 250,
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 10,
    color: '#737d8a',
    marginTop: 4,
  },
  timestampRight: {
    textAlign: 'right',
  },
  timestampLeft: {
    textAlign: 'left',
  },

  // ── Input bar ─────────────────────────────────────────────────────────
  inputDivider: {
    height: 1,
    backgroundColor: '#e0ebff',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(250, 245, 236, 0.97)',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
    gap: 10,
  },
  plusBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#cce0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 22,
    color: '#0050c8',
    lineHeight: 26,
  },
  inputField: {
    flex: 1,
    height: 38,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    borderRadius: 20,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#12213b',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendText: {
    color: '#ffffff',
    fontSize: 14,
  },
});
