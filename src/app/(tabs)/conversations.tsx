import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getMessages, getSarahStarted, getTradeStatus } from '../store';
import { SafeAreaView } from 'react-native-safe-area-context';

type Conversation = {
  id: string;
  name: string;
  initials: string;
  exchange: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatarBg: string;
};

const ONGOING: Conversation[] = [
  {
    id: '1',
    name: 'Sarah Levinson',
    initials: 'SL',
    exchange: 'Python ↔ Guitar',
    lastMessage: 'Glad u liked it.. maybe we cou...',
    time: '2h',
    unread: 2,
    avatarBg: '#4a70c4',
  },
  {
    id: '2',
    name: 'Jane Doe',
    initials: 'JD',
    exchange: 'Figma ↔ Spanish',
    lastMessage: 'You: excellent',
    time: '3h',
    unread: 0,
    avatarBg: '#d9684a',
  },
  {
    id: '3',
    name: 'Daniel R. Méndez',
    initials: 'DM',
    exchange: 'Music ↔ Photography',
    lastMessage: 'Ok nvm',
    time: '1d',
    unread: 0,
    avatarBg: '#3aab82',
  },
];

const PREVIOUS: Conversation[] = [
  {
    id: '4',
    name: 'Carlos Ruiz',
    initials: 'CR',
    exchange: 'Theory ↔ Editing',
    lastMessage: 'Thanks for the session!',
    time: '3d',
    unread: 0,
    avatarBg: '#c47a20',
  },
  {
    id: '5',
    name: 'Maria Lopez',
    initials: 'ML',
    exchange: 'Design ↔ Cooking',
    lastMessage: 'Sounds great, see you then',
    time: '5d',
    unread: 0,
    avatarBg: '#8a5cc4',
  },
  {
    id: '6',
    name: 'Alex Rivera',
    initials: 'AR',
    exchange: 'Python ↔ Yoga',
    lastMessage: 'You: Perfect, confirmed!',
    time: '1w',
    unread: 0,
    avatarBg: '#1a7a9a',
  },
  {
    id: '7',
    name: 'Sofia Torres',
    initials: 'ST',
    exchange: 'Language ↔ Guitar',
    lastMessage: 'Great exchange, thank you!',
    time: '2w',
    unread: 0,
    avatarBg: '#b03a6a',
  },
];

function ConversationCard({ item, onPress, statusLabel, statusColor }: {
  item: Conversation;
  onPress?: () => void;
  statusLabel?: string;
  statusColor?: string;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={onPress ? 0.8 : 1} onPress={onPress}>
      {/* Avatar */}
      <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
        <Text style={styles.initials}>{item.initials}</Text>
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.tagRow}>
          <View style={styles.exchangeTag}>
            <Text style={styles.exchangeText}>{item.exchange}</Text>
          </View>
          {statusLabel && (
            <View style={[styles.statusPill, { backgroundColor: statusColor }]}>
              <Text style={styles.statusPillText}>{statusLabel}</Text>
            </View>
          )}
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {/* Right: time + unread */}
      <View style={styles.cardRight}>
        <Text style={styles.time}>{item.time}</Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ConversationsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'ongoing' | 'previous'>('ongoing');
  const [sarahVisible, setSarahVisible] = useState(false);
  const [tradeStatus, setTradeStatus] = useState<'awaiting' | 'user_confirmed' | 'ongoing' | 'cancelled' | null>(null);
  const [sarahLastMessage, setSarahLastMessage] = useState<string | null>(null);

  useFocusEffect(useCallback(() => {
    setSarahVisible(getSarahStarted());
    setTradeStatus(getTradeStatus());
    const msgs = getMessages();
    if (msgs.length > 0) {
      const last = msgs[msgs.length - 1];
      setSarahLastMessage((last.sent ? 'You: ' : '') + last.text);
    }
  }, []));

  const sarahCancelled = sarahVisible && tradeStatus === 'cancelled';

  const ongoingData = (sarahVisible && !sarahCancelled ? ONGOING : ONGOING.filter(c => c.id !== '1')).map(c =>
    c.id === '1' ? { ...c, lastMessage: sarahLastMessage ?? '' } : c
  );

  const previousData = sarahCancelled
    ? [{ ...ONGOING[0], lastMessage: sarahLastMessage ?? '', unread: 0 }, ...PREVIOUS]
    : PREVIOUS;

  const data = tab === 'ongoing' ? ongoingData : previousData;

  return (
    <LinearGradient
      colors={['#cce0ff', '#faf5ec']}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header: title left, logo right */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Conversations</Text>
          <Image
            source={require('@/assets/images/trueque-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        {/* Tab pills */}
        <View style={styles.tabRow}>
          {/* On-going */}
          <TouchableOpacity
            style={tab === 'ongoing' ? styles.pillActive : styles.pillInactive}
            onPress={() => setTab('ongoing')}
            activeOpacity={0.85}
          >
            <Text style={tab === 'ongoing' ? styles.pillTextActive : styles.pillTextInactive}>On-going</Text>
            <View style={tab === 'ongoing' ? styles.badgeOrange : styles.badgeGray}>
              <Text style={styles.badgeText}>{ongoingData.length}</Text>
            </View>
          </TouchableOpacity>

          {/* Previous */}
          <TouchableOpacity
            style={tab === 'previous' ? styles.pillActive : styles.pillInactive}
            onPress={() => setTab('previous')}
            activeOpacity={0.85}
          >
            <Text style={tab === 'previous' ? styles.pillTextActive : styles.pillTextInactive}>
              Previous
            </Text>
            <View style={tab === 'previous' ? styles.badgeOrange : styles.badgeGray}>
              <Text style={styles.badgeText}>{previousData.length}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Conversation list */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ConversationCard
              item={item}
              onPress={item.id === '1' ? () => router.push('/chat') : undefined}
              statusLabel={item.id === '1' && tradeStatus && tradeStatus !== 'cancelled' ? (tradeStatus === 'ongoing' ? 'On-going' : 'Awaiting') : undefined}
              statusColor={item.id === '1' && tradeStatus && tradeStatus !== 'cancelled' ? (tradeStatus === 'ongoing' ? '#57cc78' : '#f08c00') : undefined}
            />
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 24,
    paddingRight: 16,
    paddingTop: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#12213b',
  },
  logo: {
    width: 110,
    height: 48,
  },
  // ── Tab pills ────────────────────────────────────────────────────────
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 16,
  },
  pillActive: {
    backgroundColor: '#f08c00',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 8,
    gap: 6,
  },
  pillInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 18,
    paddingRight: 10,
    paddingVertical: 8,
    gap: 6,
  },
  pillTextActive: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  pillTextInactive: {
    color: '#12213b',
    fontSize: 14,
    fontWeight: '500',
  },
  badgeOrange: {
    backgroundColor: '#0050c8',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeGray: {
    backgroundColor: 'rgba(153, 153, 153, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  // ── Conversation list ────────────────────────────────────────────────
  list: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  // ── Card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  initials: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#12213b',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exchangeTag: {
    backgroundColor: '#cce0ff',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  exchangeText: {
    color: '#0050c8',
    fontSize: 10,
    fontWeight: '500',
  },
  statusPill: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 12,
    color: 'rgba(18, 33, 59, 0.75)',
  },
  cardRight: {
    alignItems: 'flex-end',
    gap: 6,
    marginLeft: 8,
  },
  time: {
    fontSize: 11,
    color: '#737d8a',
  },
  unreadBadge: {
    backgroundColor: '#f08c00',
    borderRadius: 11,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
});
