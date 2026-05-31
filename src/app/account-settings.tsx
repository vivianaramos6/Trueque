import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PRESET_SKILLS = [
  'Web Development', 'Graphic Design', 'Photography', 'Video Editing',
  'Music Production', 'Writing', 'Translation', 'Tutoring', 'Cooking',
  'Fitness Training', 'Plumbing', 'Carpentry', 'Painting', 'Gardening',
  'Pet Care', 'Accounting', 'Marketing', 'Social Media', 'Sewing', 'Baking',
  'Guitar Lessons', 'Music', 'Spanish', 'Python', 'Coding',
];

const INITIAL_LOOKING_FOR = ['Guitar Lessons', 'Music', 'Spanish'];

const DEFAULTS = {
  name: 'Daniel Rivera',
  handle: 'danielrm',
  email: 'daniel@upr.edu',
  phone: '+1 787 555 0192',
  isPrivate: false,
  lookingFor: INITIAL_LOOKING_FOR,
};

export default function AccountSettingsScreen() {
  const router = useRouter();

  const [name, setName] = useState(DEFAULTS.name);
  const [handle, setHandle] = useState(DEFAULTS.handle);
  const [isPrivate, setIsPrivate] = useState(DEFAULTS.isPrivate);
  const [email, setEmail] = useState(DEFAULTS.email);
  const [phone, setPhone] = useState(DEFAULTS.phone);
  const [lookingFor, setLookingFor] = useState<string[]>(DEFAULTS.lookingFor);
  const [showSkillModal, setShowSkillModal] = useState(false);

  function handleReset() {
    setName(DEFAULTS.name);
    setHandle(DEFAULTS.handle);
    setIsPrivate(DEFAULTS.isPrivate);
    setEmail(DEFAULTS.email);
    setPhone(DEFAULTS.phone);
    setLookingFor(DEFAULTS.lookingFor);
  }

  function toggleSkill(skill: string) {
    setLookingFor((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  return (
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#faf5ec']} locations={[0, 0.4, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} hitSlop={12} activeOpacity={0.7}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Account Settings</Text>
          <Image source={require('@/assets/images/trueque-logo.png')} style={styles.logo} contentFit="contain" />
        </View>
        <View style={styles.headerDivider} />

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* ── Profile appearance ── */}
          <View style={styles.card}>
            <Text style={styles.cardHint}>How do you want to be seen</Text>

            <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>DR</Text>
              </View>
              <View style={styles.avatarBadge}>
                <Text style={styles.avatarBadgeText}>✏</Text>
              </View>
            </TouchableOpacity>

            <Text style={styles.fieldLabel}>Name</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#737d8a"
              />
              <TouchableOpacity onPress={() => setName('')} style={styles.inputAction} activeOpacity={0.7}>
                <Text style={styles.inputActionText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Username</Text>
            <View style={styles.inputRow}>
              <Text style={styles.atSign}>@</Text>
              <TextInput
                style={[styles.input, styles.inputFlex]}
                value={handle}
                onChangeText={setHandle}
                placeholder="yourhandle"
                placeholderTextColor="#737d8a"
                autoCapitalize="none"
              />
              <View style={styles.inputAction}>
                <Text style={styles.inputActionText}>🔒</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.privateRow} onPress={() => setIsPrivate(!isPrivate)} activeOpacity={0.8}>
              <View style={[styles.checkbox, isPrivate ? styles.checkboxOn : styles.checkboxOff]}>
                {isPrivate && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.privateLabel}>🔒  Private account/view</Text>
              <Text style={styles.warnIcon}>⚠</Text>
            </TouchableOpacity>
          </View>

          {/* ── Basic info ── */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Edit basic info</Text>
              <Text style={styles.infoIcon}>ⓘ</Text>
            </View>

            <Text style={styles.fieldLabel}>Email</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor="#737d8a"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setEmail('')} style={styles.inputAction} activeOpacity={0.7}>
                <Text style={styles.inputActionText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>Phone Number</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="+1 000 000 0000"
                placeholderTextColor="#737d8a"
                keyboardType="phone-pad"
              />
              <TouchableOpacity onPress={() => setPhone('')} style={styles.inputAction} activeOpacity={0.7}>
                <Text style={styles.inputActionText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Credibility ── */}
          <View style={styles.card}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Proof of credibility</Text>
              <Text style={styles.infoIcon}>ⓘ</Text>
            </View>
            <View style={styles.credRow}>
              <TouchableOpacity style={[styles.credBtn, styles.credBtnOutline]} activeOpacity={0.85}>
                <Text style={styles.credBtnOutlineText}>Send Confirmation</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.credBtn, styles.credBtnFilled]} activeOpacity={0.85}>
                <Text style={styles.credBtnFilledText}>⬆  Upload File</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.credCount}>2 of 8  (32 max each)</Text>
            <TouchableOpacity style={styles.editCredBtn} activeOpacity={0.85}>
              <Text style={styles.editCredBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* ── Looking for ── */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Looking for</Text>
            <View style={styles.chipsRow}>
              {lookingFor.map((skill) => (
                <TouchableOpacity key={skill} style={styles.chip} onPress={() => toggleSkill(skill)} activeOpacity={0.8}>
                  <Text style={styles.chipText}>{skill}  ✕</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.addChip} onPress={() => setShowSkillModal(true)} activeOpacity={0.8}>
                <Text style={styles.addChipText}>+ Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Actions ── */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.85}>
              <Text style={styles.resetBtnText}>Reset Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>

        {/* Skill picker modal */}
        <Modal visible={showSkillModal} animationType="slide" transparent>
          <Pressable style={styles.modalOverlay} onPress={() => setShowSkillModal(false)}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>Skills you're looking for</Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.modalChips}>
                  {PRESET_SKILLS.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={lookingFor.includes(skill) ? styles.chipSelected : styles.chipUnselected}
                      onPress={() => toggleSkill(skill)}
                      activeOpacity={0.7}
                    >
                      <Text style={lookingFor.includes(skill) ? styles.chipSelectedText : styles.chipUnselectedText}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
              <TouchableOpacity style={styles.modalDoneBtn} onPress={() => setShowSkillModal(false)} activeOpacity={0.85}>
                <Text style={styles.modalDoneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
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
  cardHint: {
    fontSize: 12,
    color: '#737d8a',
    marginBottom: 16,
    fontWeight: '500',
  },

  // ── Avatar ────────────────────────────────────────────────────────────
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3aab82',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#ffffff' },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  avatarBadgeText: { fontSize: 12, color: '#ffffff' },

  // ── Fields ────────────────────────────────────────────────────────────
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#737d8a',
    marginBottom: 6,
    marginTop: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    height: 44,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#12213b',
  },
  inputFlex: { flex: 1 },
  inputAction: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputActionText: { fontSize: 14, color: '#737d8a' },
  atSign: { fontSize: 15, fontWeight: '600', color: '#0050c8', marginRight: 4 },

  // ── Private row ───────────────────────────────────────────────────────
  privateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxOn: { backgroundColor: '#f08c00', borderColor: '#f08c00' },
  checkboxOff: { backgroundColor: '#ffffff', borderColor: '#0050c8' },
  checkmark: { fontSize: 12, fontWeight: '700', color: '#ffffff', lineHeight: 16 },
  privateLabel: { flex: 1, fontSize: 13, color: '#12213b', fontWeight: '500' },
  warnIcon: { fontSize: 15 },

  // ── Section header ─────────────────────────────────────────────────────
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#12213b',
  },
  infoIcon: { fontSize: 15, color: '#737d8a' },

  // ── Credibility ───────────────────────────────────────────────────────
  credRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  credBtn: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  credBtnOutline: {
    borderWidth: 2,
    borderColor: '#0050c8',
    backgroundColor: '#ffffff',
  },
  credBtnOutlineText: { fontSize: 12, fontWeight: '600', color: '#0050c8' },
  credBtnFilled: { backgroundColor: '#0050c8' },
  credBtnFilledText: { fontSize: 12, fontWeight: '600', color: '#ffffff' },
  credCount: {
    fontSize: 12,
    color: '#737d8a',
    textAlign: 'center',
    marginBottom: 10,
  },
  editCredBtn: {
    alignSelf: 'center',
    backgroundColor: '#f0f6ff',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    paddingHorizontal: 24,
    paddingVertical: 6,
  },
  editCredBtnText: { fontSize: 13, fontWeight: '600', color: '#0050c8' },

  // ── Chips ─────────────────────────────────────────────────────────────
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  chip: {
    backgroundColor: '#f08c00',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: { fontSize: 13, fontWeight: '600', color: '#ffffff' },
  addChip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    backgroundColor: '#f0f6ff',
  },
  addChipText: { fontSize: 13, fontWeight: '600', color: '#0050c8' },

  // ── Actions ───────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
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

  // ── Skill modal ───────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#12213b',
    textAlign: 'center',
  },
  modalScroll: { maxHeight: 320 },
  modalChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
});
