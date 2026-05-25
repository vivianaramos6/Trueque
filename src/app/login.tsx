import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    router.replace('/(tabs)');
  }

  return (
    <LinearGradient colors={['#faf5ec', '#cce0ff']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
<KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>

            <View style={styles.logoSection}>
              <Image
                source={require('@/assets/images/trueque-logo.png')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            <Text style={styles.welcome}>Welcome back</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#b8b8c0"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={[styles.label, styles.labelGap]}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#b8b8c0"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity activeOpacity={0.7} style={styles.forgotWrap}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.85}>
                <Text style={styles.loginButtonText}>Log in</Text>
              </TouchableOpacity>

              <View style={styles.signUpRow}>
                <Text style={styles.noAccountText}>Don't have an account?</Text>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.signUpText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
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
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 60,
    paddingBottom: 48,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 16,
  },
  logo: {
    width: 282,
    height: 130,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2a2a2a',
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444444',
  },
  labelGap: {
    marginTop: 14,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d4d4d8',
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 18,
    fontSize: 15,
    color: '#2a2a2a',
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f08c02',
    textDecorationLine: 'underline',
  },
  actions: {
    marginTop: 24,
    gap: 20,
  },
  loginButton: {
    backgroundColor: '#f08c02',
    borderRadius: 50,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  signUpRow: {
    alignItems: 'center',
    gap: 4,
  },
  noAccountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2a2a2a',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f08c02',
    textDecorationLine: 'underline',
  },
});
