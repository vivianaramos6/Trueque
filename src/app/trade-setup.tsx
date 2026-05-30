import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  cancelTrade,
  confirmTrade,
  getTradeDate,
  getTradeLocation,
  getTradeStatus,
  getTradeTime,
  resetConfirmation,
  setTradeDetails,
  startSarahConversation,
} from './store';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function isConfirmedStatus() {
  const s = getTradeStatus();
  return s === 'user_confirmed' || s === 'ongoing';
}

export default function TradeSetupScreen() {
  const router = useRouter();
  const { fromChat } = useLocalSearchParams<{ fromChat?: string }>();
  const [isReadonly, setIsReadonly] = useState(isConfirmedStatus);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [confirmedAvailability, setConfirmedAvailability] = useState(false);
  const [location, setLocation] = useState(getTradeLocation);
  const [date, setDate] = useState(getTradeDate);
  const [time, setTime] = useState(getTradeTime);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  function handleEdit() {
    resetConfirmation();
    setIsReadonly(false);
    setAgreedTerms(false);
    setConfirmedAvailability(false);
  }

  function handleConfirm() {
    if (!agreedTerms || !confirmedAvailability) return;
    setTradeDetails(location, date, time);
    confirmTrade();
    setIsReadonly(true);
    setShowConfirmed(true);
  }

  return (
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#faf5ec']} locations={[0, 0.3, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Request Skill Exchange</Text>
          <Image source={require('@/assets/images/trueque-logo.png')} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.headerDivider} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Exchange summary */}
          <View style={styles.exchangeCard}>
            <View style={styles.exchangeSide}>
              <Text style={styles.exchangeLabel}>You Receive:</Text>
              <Text style={styles.exchangeValue}>Guitar Lessons</Text>
            </View>
            <Text style={styles.exchangeArrow}>⇄</Text>
            <View style={[styles.exchangeSide, styles.exchangeSideRight]}>
              <Text style={styles.exchangeLabel}>You Offer:</Text>
              <Text style={styles.exchangeValue}>Python Tutoring</Text>
            </View>
          </View>

          {/* Details heading + Edit/Cancel buttons */}
          <View style={styles.detailsRow}>
            <Text style={styles.detailsHeading}>Details</Text>
            {isReadonly && (
              <View style={styles.detailsActions}>
                <TouchableOpacity style={styles.editBtn} onPress={handleEdit} activeOpacity={0.8}>
                  <Text style={styles.editBtnText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowCancelConfirm(true)} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.sessionsRow}>
            {/* Your Session */}
            <View style={[styles.sessionCard, styles.sessionCardBlue]}>
              <Text style={styles.sessionTitle}>Your Session</Text>
              <Text style={styles.sessionFieldLabel}>Location</Text>
              <TextInput
                style={[styles.sessionInput, isReadonly && styles.sessionInputReadonly]}
                placeholder="Pueblo, PR"
                placeholderTextColor="rgba(18,33,59,0.4)"
                value={location}
                onChangeText={setLocation}
                editable={!isReadonly}
              />
              <Text style={styles.sessionFieldLabel}>Date</Text>
              <TextInput
                style={[styles.sessionInput, isReadonly && styles.sessionInputReadonly]}
                placeholder="May 20, 2026"
                placeholderTextColor="rgba(18,33,59,0.4)"
                value={date}
                onChangeText={setDate}
                editable={!isReadonly}
              />
              <Text style={styles.sessionFieldLabel}>Time</Text>
              <TextInput
                style={[styles.sessionInput, { marginBottom: 0 }, isReadonly && styles.sessionInputReadonly]}
                placeholder="6:00 – 7:00 pm"
                placeholderTextColor="rgba(18,33,59,0.4)"
                value={time}
                onChangeText={setTime}
                editable={!isReadonly}
              />
            </View>

            {/* Their Session (Sarah's – pre-filled) */}
            <View style={[styles.sessionCard, styles.sessionCardOrange]}>
              <Text style={styles.sessionTitle}>Their Session</Text>
              <Text style={styles.sessionFieldLabel}>Location</Text>
              <View style={[styles.sessionStatic, { marginBottom: 10 }]}>
                <Text style={styles.sessionStaticText}>San Juan, PR</Text>
              </View>
              <Text style={styles.sessionFieldLabel}>Date</Text>
              <View style={[styles.sessionStatic, { marginBottom: 10 }]}>
                <Text style={styles.sessionStaticText}>May 20, 2026</Text>
              </View>
              <Text style={styles.sessionFieldLabel}>Time</Text>
              <View style={styles.sessionStatic}>
                <Text style={styles.sessionStaticText}>6:00 – 7:00 pm</Text>
              </View>
            </View>
          </View>

          <Text style={styles.deadlineLabel}>Deadline:</Text>
          <View style={styles.deadlineInput}>
            <Text style={styles.deadlineText}>May 30, 2026</Text>
            <Ionicons name="calendar-outline" size={20} color="#737d8a" />
          </View>

          {!isReadonly && (
            <>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setAgreedTerms(!agreedTerms)} activeOpacity={0.8}>
                <View style={[styles.checkbox, agreedTerms ? styles.checkboxOn : styles.checkboxOff]}>
                  {agreedTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>I agree to the exchange terms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.checkboxRow} onPress={() => setConfirmedAvailability(!confirmedAvailability)} activeOpacity={0.8}>
                <View style={[styles.checkbox, confirmedAvailability ? styles.checkboxOn : styles.checkboxOff]}>
                  {confirmedAvailability && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>I confirm my availability</Text>
              </TouchableOpacity>
              <View style={styles.buttonsRow}>
                <TouchableOpacity style={styles.btnMessage} activeOpacity={0.85} onPress={() => { startSarahConversation(); router.push('/chat'); }}>
                  <Text style={styles.btnMessageText}>MESSAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnConfirm, (!agreedTerms || !confirmedAvailability) && styles.btnDisabled]}
                  activeOpacity={(!agreedTerms || !confirmedAvailability) ? 1 : 0.85}
                  onPress={handleConfirm}
                >
                  <Text style={styles.btnConfirmText}>CONFIRM</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>

        {/* Confirmed modal */}
        <Modal visible={showConfirmed} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Request Sent!</Text>
              <Text style={styles.modalBody}>Your skill exchange request has been sent to Sarah Levinson.</Text>
              <View style={styles.modalBtnsRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnOutline]}
                  activeOpacity={0.85}
                  onPress={() => { setShowConfirmed(false); router.replace('/(tabs)'); }}
                >
                  <Text style={styles.modalBtnOutlineText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalBtn}
                  activeOpacity={0.85}
                  onPress={() => { setShowConfirmed(false); fromChat === '1' ? router.back() : router.replace('/chat'); }}
                >
                  <Text style={styles.modalBtnText}>Go to Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Cancel confirmation modal */}
        <Modal visible={showCancelConfirm} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Cancel Trade?</Text>
              <Text style={styles.modalBody}>
                Are you sure you want to cancel this trade? The conversation will be moved to the <Text style={styles.modalBold}>Previous</Text> tab in Conversations.
              </Text>
              <View style={styles.modalBtnsRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnOutline]}
                  activeOpacity={0.85}
                  onPress={() => setShowCancelConfirm(false)}
                >
                  <Text style={styles.modalBtnOutlineText}>Keep</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnRed]}
                  activeOpacity={0.85}
                  onPress={() => { setShowCancelConfirm(false); cancelTrade(); router.back(); }}
                >
                  <Text style={styles.modalBtnText}>Cancel Trade</Text>
                </TouchableOpacity>
              </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backArrow: { fontSize: 34, color: '#12213b', lineHeight: 40, marginRight: 6 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#12213b' },
  logo: { width: 100, height: 44 },
  headerDivider: { height: 1, backgroundColor: '#e0ebff' },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },
  exchangeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 24,
  },
  exchangeSide: { flex: 1 },
  exchangeSideRight: { alignItems: 'flex-end' },
  exchangeLabel: { fontSize: 11, color: '#737d8a', marginBottom: 4 },
  exchangeValue: { fontSize: 14, fontWeight: '700', color: '#12213b' },
  exchangeArrow: { fontSize: 22, color: '#0050c8', marginHorizontal: 8 },
  detailsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  detailsHeading: { fontSize: 20, fontWeight: '700', color: '#12213b' },
  detailsActions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#0050c8', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6 },
  editBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '600' },
  cancelBtn: { backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: '#cc3333' },
  cancelBtnText: { color: '#cc3333', fontSize: 13, fontWeight: '600' },
  sessionsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  sessionCard: { flex: 1, borderRadius: 14, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 10, elevation: 3 },
  sessionCardBlue: { backgroundColor: '#0050c8' },
  sessionCardOrange: { backgroundColor: '#f08c00' },
  sessionTitle: { fontSize: 12, fontWeight: '600', color: '#ffffff', marginBottom: 10 },
  sessionFieldLabel: { fontSize: 10, color: 'rgba(255,255,255,0.85)', marginBottom: 4 },
  sessionInput: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1.5, borderColor: '#e0ebff', height: 30, paddingHorizontal: 8, fontSize: 11, color: '#12213b', marginBottom: 10 },
  sessionInputReadonly: { opacity: 0.6 },
  sessionStatic: { backgroundColor: '#ffffff', borderRadius: 8, borderWidth: 1.5, borderColor: '#e0ebff', height: 30, paddingHorizontal: 8, justifyContent: 'center' },
  sessionStaticText: { fontSize: 11, color: '#12213b' },
  deadlineLabel: { fontSize: 14, fontWeight: '600', color: '#12213b', marginBottom: 8 },
  deadlineInput: { backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1.5, borderColor: '#e0ebff', height: 44, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  deadlineText: { fontSize: 14, color: '#12213b' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  checkboxOn: { backgroundColor: '#f08c00', borderColor: '#f08c00' },
  checkboxOff: { backgroundColor: '#ffffff', borderColor: '#0050c8' },
  checkmark: { fontSize: 12, fontWeight: '700', color: '#ffffff', lineHeight: 16 },
  checkboxLabel: { fontSize: 13, color: '#12213b' },
  buttonsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnMessage: { flex: 1, height: 52, borderRadius: 26, borderWidth: 2, borderColor: '#0050c8', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  btnMessageText: { fontSize: 15, fontWeight: '600', color: '#0050c8' },
  btnConfirm: { flex: 1, height: 52, borderRadius: 26, backgroundColor: '#f08c00', justifyContent: 'center', alignItems: 'center' },
  btnConfirmText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  btnDisabled: { backgroundColor: '#c0c0c0' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  modalBox: { backgroundColor: '#ffffff', borderRadius: 20, padding: 28, alignItems: 'center', width: '100%' },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#12213b', marginBottom: 10 },
  modalBody: { fontSize: 14, color: '#737d8a', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalBtnsRow: { flexDirection: 'row', gap: 10, width: '100%' },
  modalBtn: { flex: 1, backgroundColor: '#f08c00', borderRadius: 26, height: 48, justifyContent: 'center', alignItems: 'center' },
  modalBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
  modalBtnOutline: { backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#0050c8' },
  modalBtnOutlineText: { fontSize: 15, fontWeight: '600', color: '#0050c8' },
  modalBtnRed: { backgroundColor: '#cc3333' },
  modalBold: { fontWeight: '700', color: '#12213b' },
});
