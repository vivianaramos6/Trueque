import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getIsGuest } from '../store';

type ServiceCard = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  exchange: string;
};

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

interface ProfileScreenProps {
  isOwnProfile?: boolean;
}

const SAMPLE_SERVICES: ServiceCard[] = [
  {
    id: '1',
    title: 'Python Tutoring',
    description: 'Python for beginners to intermediate. Data structures, scripting, and real projects.',
    tags: ['Python', 'Coding'],
    exchange: 'Guitar Lessons',
  },
  {
    id: '2',
    title: 'Web Development',
    description: 'Modern web apps with React and TypeScript. UI/UX focused development.',
    tags: ['Coding', 'Web'],
    exchange: 'Music Lessons',
  },
];

const LOOKING_FOR = ['Guitar Lessons', 'Music', 'Spanish'];

const SAMPLE_REVIEWS: Review[] = [
  {
    id: '1',
    author: 'James Park',
    rating: 5,
    text: 'Daniel explained Python concepts clearly and was very patient throughout.',
    date: '2 weeks ago',
  },
  {
    id: '2',
    author: 'Laura Méndez',
    rating: 5,
    text: 'Great tutor, helped me build my first web app. Highly recommend!',
    date: '1 month ago',
  },
];

function SkillChip({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.skillChip}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={styles.skillChipText}>{label}</Text>
    </TouchableOpacity>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={styles.star}>
          {i <= rating ? '★' : '☆'}
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewAvatar}>
          <Text style={styles.reviewAvatarText}>
            {review.author.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewAuthor}>{review.author}</Text>
          <Text style={styles.reviewDate}>{review.date}</Text>
        </View>
      </View>
      <StarRating rating={review.rating} />
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
}

function ServiceCard({ service }: { service: ServiceCard }) {
  return (
    <View style={styles.serviceCard}>
      <View style={styles.serviceCardTop}>
        <View>
          <Text style={styles.serviceTitle}>{service.title}</Text>
          <View style={styles.exchangeBadge}>
            <Text style={styles.exchangeText}>↔ {service.exchange}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.serviceDescription}>{service.description}</Text>
      <View style={styles.tagsRow}>
        {service.tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function ProfileScreen({ isOwnProfile = true }: ProfileScreenProps) {
  const router = useRouter();

  if (getIsGuest()) {
    return (
      <LinearGradient colors={['#cce0ff', '#f0f6ff', '#ffffff']} locations={[0, 0.4, 1]} style={styles.gradient}>
        <SafeAreaView style={styles.safe} edges={['top']}>
          <View style={styles.guestWall}>
            <Text style={styles.guestWallTitle}>Your Profile</Text>
            <Text style={styles.guestWallBody}>Sign in or create an account to view and manage your profile.</Text>
            <TouchableOpacity style={styles.guestBtnPrimary} activeOpacity={0.85} onPress={() => router.push('/login')}>
              <Text style={styles.guestBtnText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guestBtnOrange} activeOpacity={0.85} onPress={() => router.push('/signup')}>
              <Text style={styles.guestBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#cce0ff', '#f0f6ff', '#ffffff']}
      locations={[0, 0.4, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ─── Profile Header ─── */}
          <View style={styles.headerSection}>
            {isOwnProfile && (
              <View style={styles.headerButtonsContainer}>
                <TouchableOpacity style={styles.editButtonTop} activeOpacity={0.8}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingsButtonTop} activeOpacity={0.8} onPress={() => router.push('/account-settings')}>
                  <Text style={styles.settingsButtonText}>⚙</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.centerContent}>
              <View style={[styles.largeAvatar, { backgroundColor: '#3aab82' }]}>
                <Text style={styles.largeAvatarText}>DR</Text>
              </View>

              <View style={styles.profileInfoContainer}>
                <Text style={styles.profileName}>Daniel Rivera</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationText}>📍 Tucson, AZ</Text>
                </View>
              </View>

              <View style={styles.skillTagsContainer}>
                {['Python', 'Web Dev', 'Coding'].map((skill) => (
                  <View key={skill} style={styles.skillTag}>
                    <Text style={styles.skillTagText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* ─── Bio Section ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bio</Text>
            <Text style={styles.bioText}>
              CS student passionate about coding and building things. Looking to expand my skills beyond tech through meaningful skill exchanges in my community.
            </Text>
          </View>

          {/* ─── Currently Offering ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Currently Offering</Text>
            <View style={styles.servicesContainer}>
              {SAMPLE_SERVICES.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </View>
          </View>

          {/* ─── Looking For ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.lookingForChips}>
              {LOOKING_FOR.map((skill) => (
                <SkillChip key={skill} label={skill} />
              ))}
            </View>
          </View>

          {/* ─── Reviews ─── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              {!isOwnProfile && (
                <TouchableOpacity style={styles.addReviewButton} activeOpacity={0.85}>
                  <Text style={styles.addReviewButtonText}>+ Add Review</Text>
                </TouchableOpacity>
              )}
            </View>
            {SAMPLE_REVIEWS.length === 0 ? (
              <Text style={styles.emptyText}>No reviews yet</Text>
            ) : (
              <View style={styles.reviewsContainer}>
                {SAMPLE_REVIEWS.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </View>
            )}
          </View>

          {/* ─── Certifications ─── */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.certificationsContainer}>
              <TouchableOpacity style={styles.certPlaceholder} activeOpacity={0.8}>
                <Text style={styles.certPlaceholderText}>📄</Text>
                <Text style={styles.certPlaceholderLabel}>Python Developer Certificate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.certPlaceholder} activeOpacity={0.8}>
                <Text style={styles.certPlaceholderText}>📄</Text>
                <Text style={styles.certPlaceholderLabel}>React & Web Development</Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ─── Header Section ───
  headerSection: {
    position: 'relative',
    marginBottom: 28,
  },
  headerButtonsContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  editButtonTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  settingsButtonTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  profileTop: {
    position: 'relative',
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  largeAvatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0050c8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingsButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 12,
  },
  profileInfoContainer: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 13,
    color: '#737d8a',
    fontWeight: '500',
  },
  skillTagsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  skillTag: {
    backgroundColor: '#f08c00',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skillTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ─── Sections ───
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 12,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ─── Bio ───
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#737d8a',
  },

  // ─── Currently Offering ───
  servicesContainer: {
    gap: 10,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#12213b',
    marginBottom: 4,
  },
  exchangeBadge: {
    backgroundColor: '#cce0ff',
    borderRadius: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  exchangeText: {
    color: '#0050c8',
    fontSize: 10,
    fontWeight: '600',
  },
  serviceDescription: {
    fontSize: 11,
    color: '#737d8a',
    lineHeight: 16,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#f08c00',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ─── Looking For ───
  lookingForChips: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: '#cce0ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ─── Reviews ───
  addReviewButton: {
    backgroundColor: '#0050c8',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addReviewButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 13,
    color: '#737d8a',
    fontStyle: 'italic',
  },
  reviewsContainer: {
    gap: 10,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e0ebff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  reviewAvatarText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0050c8',
  },
  reviewMeta: {
    flex: 1,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#12213b',
    marginBottom: 1,
  },
  reviewDate: {
    fontSize: 10,
    color: '#737d8a',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 6,
  },
  star: {
    fontSize: 14,
    color: '#f08c00',
  },
  reviewText: {
    fontSize: 12,
    color: '#737d8a',
    lineHeight: 18,
  },

  // ─── Certifications ───
  certificationsContainer: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  certPlaceholder: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0ebff',
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minWidth: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  certPlaceholderText: {
    fontSize: 28,
    marginBottom: 6,
  },
  certPlaceholderLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#12213b',
    textAlign: 'center',
  },
  guestWall: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, gap: 12 },
  guestWallTitle: { fontSize: 24, fontWeight: '700', color: '#12213b', textAlign: 'center' },
  guestWallBody: { fontSize: 14, color: '#737d8a', textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  guestBtnPrimary: { width: '100%', height: 48, borderRadius: 26, backgroundColor: '#0050c8', justifyContent: 'center', alignItems: 'center' },
  guestBtnOrange: { width: '100%', height: 48, borderRadius: 26, backgroundColor: '#f08c00', justifyContent: 'center', alignItems: 'center' },
  guestBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
