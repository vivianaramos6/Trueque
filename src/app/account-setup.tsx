import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STEPS = ['Location', 'Skills', 'Profile'] as const;

const PRESET_SKILLS = [
  'Web Development', 'Graphic Design', 'Photography', 'Video Editing',
  'Music Production', 'Writing', 'Translation', 'Tutoring', 'Cooking',
  'Fitness Training', 'Plumbing', 'Carpentry', 'Painting', 'Gardening',
  'Pet Care', 'Accounting', 'Marketing', 'Social Media', 'Sewing', 'Baking',
];

const BLUE = '#3b7fd4';
const ORANGE = '#f08c02';
const MIN_RADIUS = 5;
const MAX_RADIUS = 150;

export default function AccountSetupScreen() {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const trackWidth = screenWidth - 64;

  const [step, setStep] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);

  // Location
  const [city, setCity] = useState('');
  const [radius, setRadius] = useState(25);

  // Skills
  const [tagline, setTagline] = useState('');
  const [offerSkills, setOfferSkills] = useState<string[]>([]);
  const [seekSkills, setSeekSkills] = useState<string[]>([]);
  const [modalTarget, setModalTarget] = useState<'offer' | 'seek' | null>(null);

  // Profile
  const [bio, setBio] = useState('');

  // Slider
  const trackLayout = useRef({ x: 0, width: trackWidth });
  const updateRadiusRef = useRef<(pageX: number) => void>(() => {});
  updateRadiusRef.current = (pageX: number) => {
    const { x, width } = trackLayout.current;
    if (width === 0) return;
    const pct = Math.max(0, Math.min(1, (pageX - x) / width));
    setRadius(Math.round(MIN_RADIUS + pct * (MAX_RADIUS - MIN_RADIUS)));
  };

  // Stable refs so the once-created PanResponder can toggle scroll
  const disableScrollRef = useRef(() => setScrollEnabled(false));
  const enableScrollRef = useRef(() => setScrollEnabled(true));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        disableScrollRef.current();
        updateRadiusRef.current(evt.nativeEvent.pageX);
      },
      onPanResponderMove: (evt) => updateRadiusRef.current(evt.nativeEvent.pageX),
      onPanResponderRelease: () => enableScrollRef.current(),
      onPanResponderTerminate: () => enableScrollRef.current(),
    })
  ).current;

  const fillPct = (radius - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS);
  const thumbLeft = fillPct * trackWidth - 10;

  function goNext() { setStep(s => s + 1); }
  function goBack() { step === 0 ? router.back() : setStep(s => s - 1); }
  function continueLater() { router.replace('/(tabs)'); }
  function finish() { router.replace('/(tabs)'); }

  function toggleSkill(skill: string, target: 'offer' | 'seek') {
    if (target === 'offer') {
      setOfferSkills(p => p.includes(skill) ? p.filter(s => s !== skill) : [...p, skill]);
    } else {
      setSeekSkills(p => p.includes(skill) ? p.filter(s => s !== skill) : [...p, skill]);
    }
  }

  return (
    <LinearGradient colors={['#faf5ec', '#cce0ff']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>

          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={goBack} style={styles.backBtn} activeOpacity={0.6}>
              <Text style={styles.backArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.topTitle}>Account Setup</Text>
            <TouchableOpacity onPress={continueLater} style={styles.laterBtn} activeOpacity={0.7}>
              <Text style={styles.laterText}>Continue later</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <View style={styles.stepWrap}>
                  <View style={[styles.dot, i <= step ? styles.dotActive : styles.dotInactive]}>
                    <Text style={styles.dotText}>{i < step ? '✓' : i + 1}</Text>
                  </View>
                  <Text style={[styles.stepLabel, i === step && styles.stepLabelActive]}>
                    {label}
                  </Text>
                </View>
                {i < STEPS.length - 1 && (
                  <View style={[styles.progressLine, i < step && styles.progressLineActive]} />
                )}
              </React.Fragment>
            ))}
          </View>

          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={scrollEnabled}>

            {/* ── Step 1: Location ── */}
            {step === 0 && (
              <>
                <Text style={styles.stepCounter}>Step 1 of 3</Text>
                <Text style={styles.heading}>Where are you from?</Text>

                <Text style={styles.fieldLabel}>City or Zip Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Mayagüez, PR"
                  placeholderTextColor="#b8b8c0"
                  value={city}
                  onChangeText={setCity}
                />

                <Text style={[styles.fieldLabel, styles.fieldGap]}>
                  Skill Search Radius —{' '}
                  <Text style={styles.radiusDisplay}>{radius} mi</Text>
                </Text>

                <View
                  style={[styles.sliderTrack, { width: trackWidth }]}
                  onLayout={() => {
                    // measure fires after layout, giving pageX relative to screen
                  }}
                  ref={(ref) => {
                    if (ref) {
                      ref.measure((_x, _y, width, _h, pageX) => {
                        trackLayout.current = { x: pageX, width };
                      });
                    }
                  }}
                  {...panResponder.panHandlers}>
                  <View style={[styles.sliderFill, { width: fillPct * trackWidth }]} />
                  <View style={[styles.sliderThumb, { left: Math.max(0, thumbLeft) }]} />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={styles.sliderLabelText}>{MIN_RADIUS} mi</Text>
                  <Text style={styles.sliderLabelText}>{MAX_RADIUS} mi</Text>
                </View>

                <TouchableOpacity
                  style={[styles.primaryBtn, styles.btnGap]}
                  onPress={goNext}
                  activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Next</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Step 2: Skills ── */}
            {step === 1 && (
              <>
                <Text style={styles.stepCounter}>Step 2 of 3</Text>
                <Text style={styles.heading}>What do you want to trade?</Text>

                <Text style={styles.fieldLabel}>Tagline</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Designer by day, chef by night"
                  placeholderTextColor="#b8b8c0"
                  value={tagline}
                  onChangeText={setTagline}
                />

                <Text style={[styles.fieldLabel, styles.fieldGap]}>Skills you offer</Text>
                <View style={styles.chipWrap}>
                  {offerSkills.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={styles.chipSelected}
                      onPress={() => toggleSkill(s, 'offer')}
                      activeOpacity={0.7}>
                      <Text style={styles.chipSelectedText}>{s}  ✕</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.chipAdd}
                    onPress={() => setModalTarget('offer')}
                    activeOpacity={0.7}>
                    <Text style={styles.chipAddText}>+ Add</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.fieldLabel, styles.fieldGap]}>Skills you're seeking</Text>
                <View style={styles.chipWrap}>
                  {seekSkills.map(s => (
                    <TouchableOpacity
                      key={s}
                      style={styles.chipSelected}
                      onPress={() => toggleSkill(s, 'seek')}
                      activeOpacity={0.7}>
                      <Text style={styles.chipSelectedText}>{s}  ✕</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.chipAdd}
                    onPress={() => setModalTarget('seek')}
                    activeOpacity={0.7}>
                    <Text style={styles.chipAddText}>+ Add</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.fieldLabel, styles.fieldGap]}>
                  Certifications or photos{' '}
                  <Text style={styles.optional}>(optional)</Text>
                </Text>
                <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
                  <Text style={styles.uploadBtnText}>⬆  Upload</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryBtn, styles.btnGap]}
                  onPress={goNext}
                  activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Last Step</Text>
                </TouchableOpacity>
              </>
            )}

            {/* ── Step 3: Profile ── */}
            {step === 2 && (
              <>
                <Text style={styles.stepCounter}>Step 3 of 3</Text>
                <Text style={styles.heading}>Set up your profile</Text>

                <TouchableOpacity style={styles.photoPlaceholder} activeOpacity={0.7}>
                  <Text style={styles.photoIcon}>📷</Text>
                  <Text style={styles.photoText}>Add profile photo</Text>
                  <Text style={styles.optional}>(optional)</Text>
                </TouchableOpacity>

                <Text style={[styles.fieldLabel, styles.fieldGap]}>About you</Text>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  placeholder="Tell others a bit about yourself..."
                  placeholderTextColor="#b8b8c0"
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <TouchableOpacity
                  style={[styles.primaryBtn, styles.btnGap]}
                  onPress={finish}
                  activeOpacity={0.85}>
                  <Text style={styles.primaryBtnText}>Finish</Text>
                </TouchableOpacity>
              </>
            )}

          </ScrollView>
        </KeyboardAvoidingView>

        {/* Skills picker modal */}
        <Modal visible={modalTarget !== null} animationType="slide" transparent>
          <Pressable style={styles.modalOverlay} onPress={() => setModalTarget(null)}>
            <View style={styles.modalSheet}>
              <Text style={styles.modalTitle}>
                {modalTarget === 'offer' ? 'Skills you offer' : "Skills you're seeking"}
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                <View style={styles.chipWrap}>
                  {PRESET_SKILLS.map(skill => {
                    const selected = modalTarget === 'offer'
                      ? offerSkills.includes(skill)
                      : seekSkills.includes(skill);
                    return (
                      <TouchableOpacity
                        key={skill}
                        style={selected ? styles.chipSelected : styles.chipUnselected}
                        onPress={() => modalTarget && toggleSkill(skill, modalTarget)}
                        activeOpacity={0.7}>
                        <Text style={selected ? styles.chipSelectedText : styles.chipUnselectedText}>
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setModalTarget(null)}
                activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>Done</Text>
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
  flex: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  backBtn: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  backArrow: {
    fontSize: 34,
    color: '#12213b',
    fontWeight: '300',
    lineHeight: 38,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  laterBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  laterText: {
    fontSize: 13,
    fontWeight: '500',
    color: BLUE,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 28,
    marginTop: 14,
    marginBottom: 4,
  },
  stepWrap: {
    alignItems: 'center',
    width: 72,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotActive: { backgroundColor: BLUE },
  dotInactive: { backgroundColor: '#d4d4d8' },
  dotText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  stepLabelActive: {
    color: BLUE,
    fontWeight: '600',
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#d4d4d8',
    marginTop: 13,
  },
  progressLineActive: { backgroundColor: BLUE },

  scroll: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 8,
  },
  stepCounter: {
    fontSize: 13,
    color: BLUE,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2a2a2a',
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
  },
  fieldGap: { marginTop: 18 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d4d4d8',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#2a2a2a',
    marginTop: 6,
  },
  bioInput: {
    height: 120,
    paddingTop: 14,
  },
  optional: {
    color: '#999',
    fontWeight: '400',
    fontSize: 13,
  },

  radiusDisplay: {
    color: BLUE,
    fontWeight: '700',
    fontSize: 15,
  },
  sliderTrack: {
    height: 6,
    backgroundColor: '#d4d4d8',
    borderRadius: 3,
    marginTop: 16,
    position: 'relative',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 6,
    backgroundColor: BLUE,
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -7,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: BLUE,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 4,
  },
  sliderLabelText: {
    fontSize: 11,
    color: '#999',
  },

  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chipSelected: {
    backgroundColor: ORANGE,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipSelectedText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
  chipUnselected: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d4d4d8',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipUnselectedText: {
    color: '#444',
    fontSize: 13,
    fontWeight: '500',
  },
  chipAdd: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipAddText: {
    color: BLUE,
    fontSize: 13,
    fontWeight: '600',
  },

  uploadBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: BLUE,
    borderRadius: 14,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  uploadBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: BLUE,
  },

  photoPlaceholder: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d4d4d8',
    borderRadius: 14,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  photoIcon: { fontSize: 32 },
  photoText: { fontSize: 15, fontWeight: '500', color: '#444' },

  primaryBtn: {
    backgroundColor: ORANGE,
    borderRadius: 50,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  btnGap: { marginTop: 32 },

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
    color: '#2a2a2a',
    textAlign: 'center',
  },
  modalScroll: {
    maxHeight: 320,
  },
});
