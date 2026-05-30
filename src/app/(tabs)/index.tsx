import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getIsGuest, getSarahStarted } from '../store';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();
  const [showGuestModal, setShowGuestModal] = useState(false);

  function handleRequest() {
    if (getIsGuest()) { setShowGuestModal(true); return; }
    getSarahStarted() ? router.push('/chat') : router.push('/trade-setup');
  }

  return (
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#ffffff']} locations={[0, 0.4, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/trueque-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
          <TouchableOpacity style={styles.loginBtn} activeOpacity={0.85} onPress={() => router.replace('/')}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Sarah Levinson service card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>SL</Text>
            </View>
            <View style={styles.cardMeta}>
              <Text style={styles.serviceTitle}>Guitar Lessons</Text>
              <Text style={styles.providerName}>Sarah Levinson</Text>
              <Text style={styles.locationText}>San Juan, PR</Text>
            </View>
            <TouchableOpacity style={styles.requestBtn} activeOpacity={0.85} onPress={handleRequest}>
              <Text style={styles.requestBtnText}>Request</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsRow}>
            {['Guitar', 'Music'].map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.description}>
            Acoustic and electric guitar for all levels. Patient instructor with 5+ years of experience.
          </Text>
          <View style={styles.divider} />
          <View style={styles.lookingForRow}>
            <Text style={styles.lookingForLabel}>Looking for:</Text>
            {['Python', 'Coding'].map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.center}>
          <Text style={styles.dummy}>DUMMY</Text>
        </View>
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
  safe: { flex: 1, paddingHorizontal: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    paddingBottom: 16,
  },
  logo: {
    width: 140,
    height: 60,
  },
  loginBtn: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1.5,
    borderColor: '#0050c8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  loginBtnText: {
    color: '#0050c8',
    fontSize: 13,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardMeta: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 2,
  },
  providerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#12213b',
    marginBottom: 2,
  },
  locationText: {
    fontSize: 11,
    color: 'rgba(115,125,138,0.75)',
  },
  requestBtn: {
    backgroundColor: '#0050c8',
    borderRadius: 20,
    width: 84,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#f08c00',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  description: {
    fontSize: 11,
    color: '#737d8a',
    lineHeight: 16,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0ebff',
    marginBottom: 10,
  },
  lookingForRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  lookingForLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#737d8a',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dummy: {
    fontSize: 32,
    fontWeight: '700',
    color: '#c0c0c0',
  },
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
