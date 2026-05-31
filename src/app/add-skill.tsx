import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addService, getServices, updateService } from './store';

const MAX_TITLE = 60;
const MAX_DESC = 400;
const MAX_LOC = 80;

const PRESET_SKILLS = [
  'Web Development', 'Graphic Design', 'Photography', 'Video Editing',
  'Music Production', 'Writing', 'Translation', 'Tutoring', 'Cooking',
  'Fitness Training', 'Plumbing', 'Carpentry', 'Painting', 'Gardening',
  'Pet Care', 'Accounting', 'Marketing', 'Social Media', 'Sewing', 'Baking',
  'Guitar Lessons', 'Music', 'Spanish', 'Python', 'Coding',
];

export default function AddSkillScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id;

  const existing = id ? getServices().find(s => s.id === id) : null;

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [exchange, setExchange] = useState<string[]>(
    existing?.exchange ? existing.exchange.split(', ').filter(Boolean) : []
  );
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeSearch, setExchangeSearch] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  function handleReset() {
    setTitle(existing?.title ?? '');
    setDescription(existing?.description ?? '');
    setExchange(existing?.exchange ? existing.exchange.split(', ').filter(Boolean) : []);
    setDate('');
    setTime('');
    setLocation('');
  }

  function toggleExchangeSkill(skill: string) {
    setExchange(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }

  function handleSave() {
    if (!title.trim()) return;
    const exchangeStr = exchange.join(', ');
    if (isEditing && id) {
      updateService(id, { title, description, exchange: exchangeStr, tags: existing?.tags ?? [] });
    } else {
      addService({ title, description, exchange: exchangeStr, tags: [] });
    }
    router.back();
  }

  return (
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#faf5ec']} locations={[0, 0.4, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{isEditing ? 'Edit Skill' : 'Adding a new skill'}</Text>
          <Image source={require('@/assets/images/trueque-logo.png')} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.headerDivider} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Basic info ── */}
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>Title</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={(t) => setTitle(t.slice(0, MAX_TITLE))}
                placeholder="Skill Title"
                placeholderTextColor="#737d8a"
              />
              <Text style={styles.charCount}>{title.length}/{MAX_TITLE}</Text>
            </View>

            <Text style={styles.fieldLabel}>In return for</Text>
            <View style={styles.chipsRow}>
              {exchange.map((skill) => (
                <TouchableOpacity key={skill} style={styles.exchangeChip} onPress={() => toggleExchangeSkill(skill)} activeOpacity={0.8}>
                  <Text style={styles.exchangeChipText}>{skill}  ✕</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addExchangeBtn} onPress={() => setShowExchangeModal(true)} activeOpacity={0.8}>
                <Text style={styles.addExchangeBtnText}>+ Add</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Description</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                value={description}
                onChangeText={(t) => setDescription(t.slice(0, MAX_DESC))}
                placeholder="Skill Description"
                placeholderTextColor="#737d8a"
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              <Text style={styles.charCountInset}>{description.length}/{MAX_DESC}</Text>
            </View>

            <Text style={styles.fieldLabel}>
              Photo of service <Text style={styles.optional}>(optional)</Text>
            </Text>
            <View style={styles.photoRow}>
              <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.85}>
                <Text style={styles.uploadBtnText}>⬆  Upload Pictures</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85}>
                <Text style={styles.cameraBtnText}>📷</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.editPhotoBtn} activeOpacity={0.85}>
              <Text style={styles.editPhotoBtnText}>Edit Photos</Text>
            </TouchableOpacity>
          </View>

          {/* ── Session Details ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Session Details</Text>

            <Text style={styles.fieldLabel}>Date & Time</Text>
            <View style={styles.dateRow}>
              <View style={[styles.inputRow, styles.inputRowFlex]}>
                <TextInput
                  style={styles.input}
                  value={date}
                  onChangeText={setDate}
                  placeholder="MM/DD/YYYY"
                  placeholderTextColor="#737d8a"
                  keyboardType="numeric"
                />
              </View>
              <TouchableOpacity style={styles.calendarBtn} activeOpacity={0.85}>
                <Text style={styles.calendarBtnText}>Set Calendar</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputRow, { marginBottom: 16 }]}>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="1:00:00"
                placeholderTextColor="#737d8a"
              />
            </View>

            <Text style={styles.fieldLabel}>Location</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={(t) => setLocation(t.slice(0, MAX_LOC))}
                placeholder="City, State"
                placeholderTextColor="#737d8a"
              />
              <Text style={styles.charCount}>{location.length}/{MAX_LOC}</Text>
            </View>

            <Text style={styles.fieldLabel}>Proof of your skill</Text>
            <View style={styles.proofRow}>
              <TouchableOpacity style={[styles.uploadBtn, styles.uploadBtnFlex]} activeOpacity={0.85}>
                <Text style={styles.uploadBtnText}>⬆  Upload File</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.editPhotoBtn} activeOpacity={0.85}>
              <Text style={styles.editPhotoBtnText}>Edit Proof</Text>
            </TouchableOpacity>
          </View>

          {/* ── Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.85}>
              <Text style={styles.resetBtnText}>Reset as Prev</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* ── Exchange skill picker modal ── */}
        <Modal visible={showExchangeModal} animationType="slide" transparent>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <Pressable style={styles.modalOverlayInner} onPress={() => { setShowExchangeModal(false); setExchangeSearch(''); }}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Skills you want in return</Text>
              <View style={styles.modalSearchRow}>
                <Text style={styles.modalSearchIcon}>🔍</Text>
                <TextInput
                  style={styles.modalSearchInput}
                  value={exchangeSearch}
                  onChangeText={setExchangeSearch}
                  placeholder="Search skills..."
                  placeholderTextColor="#737d8a"
                  autoCapitalize="none"
                />
              </View>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.modalChips}>
                  {PRESET_SKILLS.filter(s => s.toLowerCase().includes(exchangeSearch.toLowerCase())).map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={exchange.includes(skill) ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => toggleExchangeSkill(skill)}
                      activeOpacity={0.7}
                    >
                      <Text style={exchange.includes(skill) ? styles.chipSelectedText : styles.chipUnselectedText}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.modalDoneBtn} onPress={() => { setShowExchangeModal(false); setExchangeSearch(''); }} activeOpacity={0.85}>
                <Text style={styles.modalDoneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
          </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backArrow: { fontSize: 34, color: '#12213b', lineHeight: 40, marginRight: 6 },
  title: { flex: 1, fontSize: 18, fontWeight: '700', color: '#12213b' },
  logo: { width: 100, height: 44 },
  headerDivider: { height: 1, backgroundColor: '#e0ebff' },

  // ── Scroll ────────────────────────────────────────────────────────────
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40, gap: 16 },

  // ── Card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 14,
  },

  // ── Fields ────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737d8a',
    marginBottom: 6,
    marginTop: 14,
  },
  optional: { fontWeight: '400', color: '#737d8a' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    height: 44,
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  inputRowFlex: { flex: 1 },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#12213b',
  },
  charCount: {
    fontSize: 11,
    color: '#737d8a',
    marginLeft: 6,
  },
  textAreaWrapper: {
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    padding: 12,
    marginBottom: 4,
  },
  textArea: {
    fontSize: 14,
    color: '#12213b',
    minHeight: 100,
  },
  charCountInset: {
    fontSize: 11,
    color: '#737d8a',
    textAlign: 'right',
    marginTop: 4,
  },

  // ── Photo / Upload ────────────────────────────────────────────────────
  photoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  uploadBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    backgroundColor: '#f0f6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBtnFlex: { flex: 1 },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0050c8',
  },
  cameraBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    backgroundColor: '#f0f6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBtnText: { fontSize: 20 },
  editPhotoBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1.5,
    borderColor: '#0050c8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: 4,
  },
  editPhotoBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ── Session Details ───────────────────────────────────────────────────
  dateRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  calendarBtn: {
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0050c8',
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  proofRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },

  // ── Actions ───────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resetBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#0050c8',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: { fontSize: 15, fontWeight: '600', color: '#0050c8' },
  saveBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f08c00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },

  // ── Exchange chips ────────────────────────────────────────────────────
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  exchangeChip: {
    backgroundColor: '#f08c00',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  exchangeChipText: { fontSize: 13, fontWeight: '600', color: '#ffffff' },
  addExchangeBtn: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    backgroundColor: '#f0f6ff',
  },
  addExchangeBtnText: { fontSize: 13, fontWeight: '600', color: '#0050c8' },

  // ── Exchange modal ────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalOverlayInner: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#faf5ec',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '72%',
    gap: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#12213b', textAlign: 'center' },
  modalScroll: { maxHeight: 320 },
  modalChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chipSelected: {
    backgroundColor: '#f08c00',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipSelectedText: { color: '#ffffff', fontSize: 13, fontWeight: '500' },
  chipUnselected: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d4d4d8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipUnselectedText: { color: '#444', fontSize: 13, fontWeight: '500' },
  modalDoneBtn: {
    backgroundColor: '#f08c00',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalDoneBtnText: { fontSize: 16, fontWeight: '600', color: '#ffffff' },
  modalSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    paddingHorizontal: 12,
    height: 40,
  },
  modalSearchIcon: { fontSize: 14, marginRight: 8 },
  modalSearchInput: { flex: 1, fontSize: 14, color: '#12213b' },
});
