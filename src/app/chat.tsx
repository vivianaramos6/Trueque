import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  getMessages,
  getSarahConfirmed,
  getTradeStatus,
  Message,
  sarahConfirmTrade,
  setMessages as storeSetMessages,
  setSarahConfirmed as storeSetSarahConfirmed,
} from './store';
import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
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

const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY!;

const SARAH_SYSTEM = `You are Sarah, a 26 year old guitar teacher chatting on Trueque, a skill-exchange app. You're exchanging guitar lessons for Python tutoring. Texting style, lowercase, keep it to 1-2 sentences. Be warm and curious — ask about their experience level, when they're free, where they're located. If they go off topic reply: "haha let's stay on topic 😄". Do not use exclamation marks unless it genuinely fits.`;

async function getSarahReply(history: Message[]): Promise<string> {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      max_tokens: 80,
      messages: [
        { role: 'system', content: SARAH_SYSTEM },
        ...history.map(m => ({ role: m.sent ? 'user' : 'assistant', content: m.text })),
      ],
    }),
  });
  const data = await response.json();
  return data.choices[0].message.content as string;
}

let _id = 0;
function makeId() { return `${Date.now()}_${++_id}`; }

function nowTime() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m} ${d.getHours() >= 12 ? 'PM' : 'AM'}`;
}

export default function ChatScreen() {
  const router = useRouter();
  const [messages, setMessagesState] = useState<Message[]>(getMessages());
  const [status, setStatus] = useState(getTradeStatus());

  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateMessages(msgs: Message[]) {
    setMessagesState(msgs);
    storeSetMessages(msgs);
  }

  useFocusEffect(useCallback(() => {
    const currentStatus = getTradeStatus();
    setStatus(currentStatus);

    if (currentStatus === 'user_confirmed' && !getSarahConfirmed() && !confirmTimerRef.current) {
      confirmTimerRef.current = setTimeout(() => {
        confirmTimerRef.current = null;
        storeSetSarahConfirmed(true);
        sarahConfirmTrade();
        setStatus('ongoing');
        const confirmMsg: Message = { id: makeId(), text: "just confirmed my side too btw 👍", sent: false, time: nowTime() };
        updateMessages([...getMessages(), confirmMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
      }, 4000);
      return () => {
        clearTimeout(confirmTimerRef.current!);
        confirmTimerRef.current = null;
      };
    }
  }, []));

  async function sendMessage() {
    const text = message.trim();
    if (!text) return;
    const userMsg: Message = { id: makeId(), text, sent: true, time: nowTime() };
    const updatedHistory = [...messages, userMsg];
    updateMessages(updatedHistory);
    setMessage('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    setIsTyping(true);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const reply = await getSarahReply(updatedHistory);
      setTimeout(() => {
        setIsTyping(false);
        const replyMsg: Message = { id: makeId(), text: reply, sent: false, time: nowTime() };
        updateMessages([...updatedHistory, replyMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
      }, 800);
    } catch {
      setTimeout(() => {
        setIsTyping(false);
        const errMsg: Message = { id: makeId(), text: "Sorry, give me a sec! 😅", sent: false, time: nowTime() };
        updateMessages([...updatedHistory, errMsg]);
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
      }, 800);
    }
  }

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

          {/* Exchange card or Request button – sticky */}
          {status === 'cancelled' ? (
            <TouchableOpacity style={styles.requestBanner} onPress={() => router.push({ pathname: '/trade-setup', params: { fromChat: '1' } })} activeOpacity={0.85}>
              <Text style={styles.requestBannerText}>Request a New Trade</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.exchangeCard}>
              <View style={styles.pillRow}>
                <View style={[styles.statusPill, { backgroundColor: status === 'ongoing' ? '#57cc78' : '#f08c00' }]}>
                  <Text style={styles.statusText}>{status === 'ongoing' ? 'On-going' : 'Awaiting Confirmation'}</Text>
                </View>
              </View>
              <View style={styles.tradeRow}>
                <View style={styles.tradeColLeft}>
                  <Text style={styles.tradeLabel}>You Receive:</Text>
                  <Text style={styles.tradeValue}>Guitar Lessons</Text>
                </View>
                <Text style={styles.tradeArrow}>⇄</Text>
                <View style={styles.tradeColRight}>
                  <Text style={styles.tradeLabel}>You Offer:</Text>
                  <Text style={styles.tradeValue}>Python Tutoring</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.viewTradeRow} onPress={() => router.push({ pathname: '/trade-setup', params: { fromChat: '1' } })}>
                <Text style={styles.viewTradeText}>View Trade ›</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Messages area */}
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.dateSep}>Today</Text>

            {messages.map((msg) => (
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
            {isTyping && (
              <View style={styles.msgGroupReceived}>
                <View style={styles.typingBubble}>
                  <Text style={styles.typingDots}>• • •</Text>
                </View>
              </View>
            )}
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
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
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

  // ── Request banner (cancelled state) ──────────────────────────────────
  requestBanner: {
    backgroundColor: '#0050c8',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  requestBannerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
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
    marginBottom: 8,
  },
  pillRow: {
    alignItems: 'center',
    marginBottom: 10,
  },
  statusPill: {
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
    paddingVertical: 10,
    maxWidth: 250,
  },
  bubbleReceived: {
    backgroundColor: '#f08c02',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: 250,
  },
  bubbleText: {
    color: '#ffffff',
    fontSize: 14,
  },
  typingBubble: {
    backgroundColor: '#f08c02',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  typingDots: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 2,
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
