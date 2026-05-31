import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteService, getIsGuest, getServices, ServiceItem } from '../store';

const PRESET_SKILLS = [
  'Web Development', 'Graphic Design', 'Photography', 'Video Editing',
  'Music Production', 'Writing', 'Translation', 'Tutoring', 'Cooking',
  'Fitness Training', 'Plumbing', 'Carpentry', 'Painting', 'Gardening',
  'Pet Care', 'Accounting', 'Marketing', 'Social Media', 'Sewing', 'Baking',
  'Guitar Lessons', 'Music', 'Spanish', 'Python', 'Coding',
];

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

type Cert = {
  id: string;
  label: string;
};

interface ProfileScreenProps {
  isOwnProfile?: boolean;
}


const INITIAL_LOOKING_FOR = ['Guitar Lessons', 'Music', 'Spanish'];

const INITIAL_CERTS: Cert[] = [
  { id: '1', label: 'Python Developer Certificate' },
  { id: '2', label: 'React & Web Development' },
];

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

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Text key={i} style={styles.star}>{i <= rating ? '★' : '☆'}</Text>
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

export default function ProfileScreen({ isOwnProfile = true }: ProfileScreenProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('CS student passionate about coding and building things. Looking to expand my skills beyond tech through meaningful skill exchanges in my community.');
  const [services, setServices] = useState<ServiceItem[]>(getServices());
  const [lookingFor, setLookingFor] = useState<string[]>(INITIAL_LOOKING_FOR);
  const [certs, setCerts] = useState<Cert[]>(INITIAL_CERTS);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showSkillModal, setShowSkillModal] = useState(false);

  useFocusEffect(useCallback(() => {
    setServices(getServices());
  }, []));

  function removeService(id: string) {
    deleteService(id);
    setServices(getServices());
    setDeleteTarget(null);
  }

  function toggleSkill(skill: string) {
    setLookingFor(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  }

  function removeCert(id: string) {
    setCerts(prev => prev.filter(c => c.id !== id));
  }

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
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#ffffff']} locations={[0, 0.4, 1]} style={styles.gradient}>
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
                <TouchableOpacity
                  style={[styles.editButtonTop, isEditing && styles.editButtonTopDone]}
                  activeOpacity={0.8}
                  onPress={() => setIsEditing(!isEditing)}
                >
                  <Text style={styles.editButtonText}>{isEditing ? 'Done' : 'Edit'}</Text>
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

          {/* ─── Bio ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bio</Text>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.bioInput}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#737d8a"
                />
                <TouchableOpacity style={styles.submitBioBtn} activeOpacity={0.85}>
                  <Text style={styles.submitBioBtnText}>Submit</Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text style={styles.bioText}>{bio}</Text>
            )}
          </View>

          {/* ─── Currently Offering ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Currently Offering</Text>
            <View style={styles.servicesContainer}>
              {services.map((service) => (
                <View key={service.id} style={styles.serviceCardWrapper}>
                  {isEditing && (
                    <TouchableOpacity
                      style={styles.deleteServiceBtn}
                      onPress={() => setDeleteTarget(service.id)}
                      hitSlop={8}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteServiceBtnText}>✕</Text>
                    </TouchableOpacity>
                  )}
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
                    {isEditing && (
                      <TouchableOpacity
                        style={styles.editServiceBtn}
                        onPress={() => router.push({ pathname: '/add-skill', params: { id: service.id } })}
                        activeOpacity={0.85}
                      >
                        <Text style={styles.editServiceBtnText}>Edit Service</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
              {isEditing && (
                <TouchableOpacity
                  style={styles.addServiceBtn}
                  onPress={() => router.push('/add-skill')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addServiceBtnText}>+ Add Service</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ─── Looking For ─── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Looking For</Text>
            <View style={styles.lookingForChips}>
              {lookingFor.map((skill) => (
                isEditing ? (
                  <TouchableOpacity key={skill} style={styles.skillChipEditing} onPress={() => toggleSkill(skill)} activeOpacity={0.8}>
                    <Text style={styles.skillChipText}>{skill}  ✕</Text>
                  </TouchableOpacity>
                ) : (
                  <View key={skill} style={styles.skillChip}>
                    <Text style={styles.skillChipText}>{skill}</Text>
                  </View>
                )
              ))}
              {isEditing && (
                <TouchableOpacity style={styles.addSkillBtn} onPress={() => setShowSkillModal(true)} activeOpacity={0.8}>
                  <Text style={styles.addSkillBtnText}>+ Add Skill</Text>
                </TouchableOpacity>
              )}
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
            {isEditing && (
              <Text style={styles.reviewsNote}>Reviews cannot be edited</Text>
            )}
            <View style={styles.reviewsContainer}>
              {SAMPLE_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </View>
          </View>

          {/* ─── Certifications ─── */}
          <View style={[styles.section, styles.lastSection]}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            <View style={styles.certificationsContainer}>
              {certs.map((cert) => (
                <View key={cert.id} style={styles.certWrapper}>
                  {isEditing && (
                    <TouchableOpacity style={styles.deleteCertBtn} onPress={() => removeCert(cert.id)} hitSlop={8} activeOpacity={0.7}>
                      <Text style={styles.deleteCertBtnText}>✕</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.certPlaceholder} activeOpacity={0.8}>
                    <Text style={styles.certPlaceholderText}>📄</Text>
                    <Text style={styles.certPlaceholderLabel}>{cert.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {isEditing && (
              <TouchableOpacity style={styles.addCertBtn} activeOpacity={0.85}>
                <Text style={styles.addCertBtnText}>+ Add Certification</Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>

        {/* ─── Delete Service Modal ─── */}
        <Modal visible={deleteTarget !== null} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>This action cannot be undone.</Text>
              <Text style={styles.modalBody}>Proceed?</Text>
              <View style={styles.modalBtnsRow}>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnOutline]} activeOpacity={0.85} onPress={() => setDeleteTarget(null)}>
                  <Text style={styles.modalBtnOutlineText}>Return</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnRed]} activeOpacity={0.85} onPress={() => deleteTarget && removeService(deleteTarget)}>
                  <Text style={styles.modalBtnText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* ─── Skill Picker Modal ─── */}
        <Modal visible={showSkillModal} animationType="slide" transparent>
          <Pressable style={styles.skillModalOverlay} onPress={() => setShowSkillModal(false)}>
            <View style={styles.skillModalSheet}>
              <Text style={styles.skillModalTitle}>Skills you're looking for</Text>
              <ScrollView showsVerticalScrollIndicator={false} style={styles.skillModalScroll}>
                <View style={styles.skillModalChips}>
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
              <TouchableOpacity style={styles.skillModalDoneBtn} onPress={() => setShowSkillModal(false)} activeOpacity={0.85}>
                <Text style={styles.skillModalDoneBtnText}>Done</Text>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },

  // ─── Header ───
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
  editButtonTopDone: {
    backgroundColor: '#f08c00',
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
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
  profileInfoContainer: { alignItems: 'center' },
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
  section: { marginBottom: 24 },
  lastSection: { marginBottom: 8 },
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

  // ─── Bio ───
  bioText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#737d8a',
  },
  bioInput: {
    backgroundColor: '#f0f6ff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0ebff',
    padding: 12,
    fontSize: 13,
    color: '#12213b',
    lineHeight: 20,
    minHeight: 90,
    marginBottom: 10,
  },
  submitBioBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#0050c8',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  submitBioBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ─── Currently Offering ───
  servicesContainer: { gap: 10 },
  serviceCardWrapper: {
    position: 'relative',
  },
  deleteServiceBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cc3333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteServiceBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
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
  editServiceBtn: {
    marginTop: 10,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    borderRadius: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  editServiceBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0050c8',
  },
  addServiceBtn: {
    borderWidth: 1.5,
    borderColor: '#0050c8',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addServiceBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0050c8',
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
  skillChipEditing: {
    backgroundColor: '#f08c00',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0050c8',
  },
  addSkillBtn: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1.5,
    borderColor: '#0050c8',
    backgroundColor: '#f0f6ff',
  },
  addSkillBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ─── Reviews ───
  reviewsNote: {
    fontSize: 12,
    color: '#737d8a',
    fontStyle: 'italic',
    marginBottom: 10,
  },
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
  reviewsContainer: { gap: 10 },
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
  reviewMeta: { flex: 1 },
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
    marginBottom: 10,
  },
  certWrapper: {
    position: 'relative',
    flex: 1,
    minWidth: '45%',
  },
  deleteCertBtn: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#cc3333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteCertBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
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
  addCertBtn: {
    borderWidth: 1.5,
    borderColor: '#0050c8',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addCertBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0050c8',
  },

  // ─── Delete modal ───
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalBox: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#12213b',
    textAlign: 'center',
    marginBottom: 6,
  },
  modalBody: {
    fontSize: 14,
    color: '#737d8a',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalBtnsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    height: 48,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBtnOutline: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#0050c8',
  },
  modalBtnOutlineText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0050c8',
  },
  modalBtnRed: { backgroundColor: '#cc3333' },
  modalBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ─── Skill modal ───
  skillModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  skillModalSheet: {
    backgroundColor: '#faf5ec',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '72%',
    gap: 16,
  },
  skillModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#12213b',
    textAlign: 'center',
  },
  skillModalScroll: { maxHeight: 320 },
  skillModalChips: {
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
  skillModalDoneBtn: {
    backgroundColor: '#f08c00',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skillModalDoneBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // ─── Guest wall ───
  guestWall: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40, gap: 12 },
  guestWallTitle: { fontSize: 24, fontWeight: '700', color: '#12213b', textAlign: 'center' },
  guestWallBody: { fontSize: 14, color: '#737d8a', textAlign: 'center', lineHeight: 20, marginBottom: 8 },
  guestBtnPrimary: { width: '100%', height: 48, borderRadius: 26, backgroundColor: '#0050c8', justifyContent: 'center', alignItems: 'center' },
  guestBtnOrange: { width: '100%', height: 48, borderRadius: 26, backgroundColor: '#f08c00', justifyContent: 'center', alignItems: 'center' },
  guestBtnText: { fontSize: 15, fontWeight: '600', color: '#ffffff' },
});
