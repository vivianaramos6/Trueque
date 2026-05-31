import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { completeExchange } from './store';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MAX_CHARS = 400;

export default function ExchangeCompleteScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [isReport, setIsReport] = useState(false);

  function handlePublish() {
    completeExchange();
    router.replace({ pathname: '/(tabs)/conversations', params: { tab: 'previous' } });
  }

  function handleClose() {
    router.back();
  }

  return (
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#faf5ec']} locations={[0, 0.4, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} hitSlop={12} activeOpacity={0.7}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Exchange Completed</Text>
          </View>

          {/* Exchange summary */}
          <View style={styles.card}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>You received</Text>
                <View style={styles.summaryIconBox}>
                  <Text style={styles.summaryEmoji}>🎸</Text>
                </View>
                <Text style={styles.summaryValue}>Guitar Lessons</Text>
              </View>
              <Text style={styles.summaryArrow}>⇄</Text>
              <View style={styles.summaryCol}>
                <Text style={styles.summaryLabel}>You gave</Text>
                <View style={styles.summaryIconBox}>
                  <Text style={styles.summaryEmoji}>💻</Text>
                </View>
                <Text style={styles.summaryValue}>Python Tutoring</Text>
              </View>
            </View>
          </View>

          {/* Feedback */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Give feedback</Text>

            {/* Star rating */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
                  <Text style={[styles.star, i <= rating && styles.starFilled]}>
                    {i <= rating ? '★' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Tell us your thoughts <Text style={styles.optional}>(Optional)</Text></Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Share your experience..."
                placeholderTextColor="#737d8a"
                value={feedback}
                onChangeText={(t) => setFeedback(t.slice(0, MAX_CHARS))}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{feedback.length}/{MAX_CHARS}</Text>
            </View>

            {/* Checkboxes */}
            <TouchableOpacity style={styles.checkRow} onPress={() => setAnonymous(!anonymous)} activeOpacity={0.8}>
              <View style={[styles.checkbox, anonymous ? styles.checkboxOn : styles.checkboxOff]}>
                {anonymous && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkLabel}>Anonymous</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.checkRow} onPress={() => setIsReport(!isReport)} activeOpacity={0.8}>
              <View style={[styles.checkbox, isReport ? styles.checkboxOn : styles.checkboxOff]}>
                {isReport && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <View style={styles.checkLabelCol}>
                <Text style={styles.checkLabel}>Make it a report to us instead</Text>
                <Text style={styles.checkSub}>(user won't get notified)</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.closeBtn} onPress={handleClose} activeOpacity={0.85}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} activeOpacity={0.85}>
              <Text style={styles.publishBtnText}>Submit</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // ── Header ────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  closeIcon: {
    fontSize: 18,
    color: '#12213b',
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#12213b',
  },

  // ── Card ─────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },

  // ── Summary ───────────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#737d8a',
    fontWeight: '500',
  },
  summaryIconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#f0f6ff',
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryEmoji: { fontSize: 28 },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#12213b',
    textAlign: 'center',
  },
  summaryArrow: {
    fontSize: 22,
    color: '#0050c8',
    paddingHorizontal: 8,
  },

  // ── Feedback ──────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 14,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  star: {
    fontSize: 36,
    color: '#d4d4d8',
  },
  starFilled: {
    color: '#f08c00',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#12213b',
    marginBottom: 8,
  },
  optional: {
    fontWeight: '400',
    color: '#737d8a',
  },
  textAreaWrapper: {
    backgroundColor: '#f0f6ff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    fontSize: 14,
    color: '#12213b',
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: '#737d8a',
    textAlign: 'right',
    marginTop: 4,
  },

  // ── Checkboxes ────────────────────────────────────────────────────────
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  checkboxOn: { backgroundColor: '#f08c00', borderColor: '#f08c00' },
  checkboxOff: { backgroundColor: '#ffffff', borderColor: '#0050c8' },
  checkmark: { fontSize: 12, fontWeight: '700', color: '#ffffff', lineHeight: 16 },
  checkLabelCol: { flex: 1 },
  checkLabel: { fontSize: 13, color: '#12213b', fontWeight: '500' },
  checkSub: { fontSize: 11, color: '#737d8a', marginTop: 2 },

  // ── Actions ───────────────────────────────────────────────────────────
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  closeBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#0050c8',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: { fontSize: 15, fontWeight: '600', color: '#0050c8' },
  publishBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f08c00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  publishBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
