import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StartScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#faf5ec', '#cce0ff']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.logoSection}>
          <Image
            source={require('@/assets/images/trueque-logo.png')}
            style={styles.logo}
            contentFit="contain"
          />
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.signUpButton} activeOpacity={0.85}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/login')} activeOpacity={0.85}>
            <Text style={styles.loginText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.guestText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 48,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 400,
    height: 200
  ,
  },
  actions: {
    width: '100%',
    paddingHorizontal: 60,
    gap: 20,
    alignItems: 'center',
  },
  signUpButton: {
    backgroundColor: '#f08c02',
    borderRadius: 50,
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#f9f9f9',
    borderRadius: 50,
    width: '100%',
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
  },
  guestText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
});
