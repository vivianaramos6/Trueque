import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#cce0ff', '#f0f6ff', '#ffffff']} locations={[0, 0.4, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/trueque-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={styles.center}>
          <Text style={styles.dummy}>DUMMY</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/')} activeOpacity={0.85}>
            <Text style={styles.backButtonText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1, paddingHorizontal: 24 },
  header: {
    alignItems: 'center',
    paddingTop: 8,
  },
  logo: {
    width: 180,
    height: 80,
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
  footer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#f08c02',
    borderRadius: 50,
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
});
