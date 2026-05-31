import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getIsGuest, getSarahStarted } from '../store';

const CATEGORIES = ['General', 'Coding', 'Guitar', 'Art', 'Music'];

type Listing = {
  id: string;
  title: string;
  tags: string[];
  description: string;
  rating: number;
  initials: string;
  avatarBg: string;
  location: string;
  lookingFor: string[];
};

const LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Guitar Lessons',
    tags: ['Guitar', 'Music'],
    description: 'Acoustic and electric guitar for all levels. Patient instructor with 5+ years of experience.',
    rating: 4.9,
    initials: 'SL',
    avatarBg: '#0050c8',
    location: 'San Juan, PR',
    lookingFor: ['Python', 'Coding'],
  },
  {
    id: '2',
    title: 'Web Design',
    tags: ['Coding', 'Design'],
    description: 'Modern responsive web design and development. Specialized in React and UI/UX.',
    rating: 4.8,
    initials: 'AC',
    avatarBg: '#3aab82',
    location: 'San Juan, PR',
    lookingFor: ['Spanish Lessons', 'Cooking', 'Photography'],
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('General');
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLookingFor, setExpandedLookingFor] = useState<Record<string, boolean>>({});

  const MAX_LOOKING_FOR = 2;

  function toggleLookingFor(id: string) {
    setExpandedLookingFor((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function handleTrueque(id: string) {
    if (getIsGuest()) { setShowGuestModal(true); return; }
    if (id === '1') {
      getSarahStarted() ? router.push('/chat') : router.push('/trade-setup');
    }
  }

  return (
    <LinearGradient colors={['#cce0ff', '#deeaf8', '#eef4ff']} locations={[0, 0.45, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.discoverTitle}>Discover</Text>
          <Image
            source={require('@/assets/images/trueque-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>

        {/* Category row: search icon + pills */}
        <View style={styles.categoriesRow}>
          {searchOpen ? (
            <>
              <TouchableOpacity style={styles.searchIconBtn} onPress={() => { setSearchOpen(false); setSearchQuery(''); }} activeOpacity={0.75}>
                <Text style={styles.searchIconText}>✕</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.searchInlineInput}
                placeholder="Search services..."
                placeholderTextColor="#737d8a"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
                returnKeyType="search"
              />
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.searchIconBtn} onPress={() => setSearchOpen(true)} activeOpacity={0.75}>
                <Text style={styles.searchIconText}>🔍</Text>
              </TouchableOpacity>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContent}
                style={styles.categoriesScroll}
              >
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryPill, activeCategory === cat && styles.categoryPillActive]}
                    onPress={() => setActiveCategory(cat)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}
        </View>

        {/* Listing cards */}
        <FlatList
          data={LISTINGS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>

              {/* Two-column body */}
              <View style={styles.cardBody}>

                {/* Left: title, tags, description */}
                <View style={styles.cardLeft}>
                  <Text style={styles.serviceTitle}>{item.title}</Text>
                  <View style={styles.tagsRow}>
                    {item.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.description}>{item.description}</Text>
                </View>

                {/* Right: rating, avatar, location, button */}
                <View style={styles.cardRight}>
                  <View style={styles.ratingRow}>
                    <Text style={styles.starIcon}>★</Text>
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <View style={styles.avatarGroup}>
                    <View style={[styles.avatar, { backgroundColor: item.avatarBg }]}>
                      <Text style={styles.avatarText}>{item.initials}</Text>
                    </View>
                    <Text style={styles.locationText}>📍 {item.location}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.truequeBtn}
                    activeOpacity={0.85}
                    onPress={() => handleTrueque(item.id)}
                  >
                    <Text style={styles.truequeBtnText}>Trueque</Text>
                  </TouchableOpacity>
                </View>

              </View>

              {/* Looking for footer */}
              <View style={styles.divider} />
              <View style={styles.lookingForRow}>
                <Text style={styles.lookingForLabel}>Looking for:</Text>
                {(expandedLookingFor[item.id]
                  ? item.lookingFor
                  : item.lookingFor.slice(0, MAX_LOOKING_FOR)
                ).map((tag) => (
                  <View key={tag} style={styles.lookingTag}>
                    <Text style={styles.lookingTagText}>{tag}</Text>
                  </View>
                ))}
                {item.lookingFor.length > MAX_LOOKING_FOR && (
                  <TouchableOpacity
                    style={styles.lookingTagMore}
                    onPress={() => toggleLookingFor(item.id)}
                    activeOpacity={0.75}
                  >
                    <Text style={styles.lookingTagMoreText}>
                      {expandedLookingFor[item.id]
                        ? 'less'
                        : `+${item.lookingFor.length - MAX_LOOKING_FOR}`}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

            </View>
          )}
        />

        {/* Guest modal */}
        <Modal visible={showGuestModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Sign in to Request</Text>
              <Text style={styles.modalBody}>To request a trade you must be signed in.</Text>
              <TouchableOpacity style={styles.modalBtnOutline} activeOpacity={0.85} onPress={() => setShowGuestModal(false)}>
                <Text style={styles.modalBtnOutlineText}>Keep Browsing</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnPrimary} activeOpacity={0.85} onPress={() => { setShowGuestModal(false); router.push('/login'); }}>
                <Text style={styles.modalBtnText}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnOrange} activeOpacity={0.85} onPress={() => { setShowGuestModal(false); router.push('/signup'); }}>
                <Text style={styles.modalBtnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  discoverTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#12213b',
  },
  logo: {
    width: 120,
    height: 52,
  },

  // ── Categories row ───────────────────────────────────────────────────
  categoriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 24,
  },
  searchIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchIconText: {
    fontSize: 15,
  },
  searchInlineInput: {
    flex: 1,
    fontSize: 14,
    color: '#12213b',
    paddingRight: 24,
  },
  categoriesScroll: {
    flexGrow: 0,
  },
  categoriesContent: {
    paddingRight: 24,
    gap: 8,
    alignItems: 'center',
  },
  categoryPill: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  categoryPillActive: {
    backgroundColor: '#0050c8',
    borderColor: '#0050c8',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#737d8a',
  },
  categoryTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // ── List ─────────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },

  // ── Card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  cardBody: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  cardLeft: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#f08c00',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  description: {
    fontSize: 12,
    color: '#737d8a',
    lineHeight: 18,
  },

  // ── Card right column ─────────────────────────────────────────────────
  cardRight: {
    width: 108,
    alignItems: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    alignSelf: 'flex-end',
  },
  starIcon: {
    fontSize: 14,
    color: '#f08c00',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12213b',
  },
  avatarGroup: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  locationText: {
    fontSize: 11,
    color: '#737d8a',
    textAlign: 'center',
  },
  truequeBtn: {
    backgroundColor: '#0050c8',
    borderRadius: 20,
    paddingVertical: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  truequeBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  // ── Looking for ───────────────────────────────────────────────────────
  divider: {
    height: 1,
    backgroundColor: '#e8eef8',
    marginBottom: 10,
  },
  lookingForRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  lookingForLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737d8a',
  },
  lookingTag: {
    backgroundColor: '#f08c00',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  lookingTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  lookingTagMore: {
    backgroundColor: 'rgba(0,80,200,0.12)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#0050c8',
  },
  lookingTagMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ── Guest modal ───────────────────────────────────────────────────────
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  modalBox: { backgroundColor: '#ffffff', borderRadius: 20, padding: 28, alignItems: 'center', width: '100%', gap: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#12213b', textAlign: 'center' },
  modalBody: { fontSize: 14, color: '#737d8a', textAlign: 'center', lineHeight: 20, marginBottom: 4 },
  modalBtnOutline: { width: '100%', height: 48, borderRadius: 26, borderWidth: 2, borderColor: '#0050c8', justifyContent: 'center', alignItems: 'center' },
  modalBtnOutlineText: { fontSize: 15, fontWeight: '600', color: '#0050c8' },
  modalBtnPrimary: { width: '100%', height: 48, borderRadius: 26, backgroundColor: '#0050c8', justifyContent: 'center', alignItems: 'center' },
  modalBtnOrange: { width: '100%', height: 48, borderRadius: 26, backgroundColor: '#f08c00', justifyContent: 'center', alignItems: 'center' },
  modalBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
