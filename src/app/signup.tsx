import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function handleSignUp() {
    Alert.alert(
      'Account created!',
      'Your account has been successfully created. Please log in to continue.',
      [{ text: 'Log in', onPress: () => router.replace('/login') }]
    );
  }

  return (
    <LinearGradient colors={['#faf5ec', '#cce0ff']} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}>

          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.6}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

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

            <Text style={styles.heading}>Create an account</Text>

            <View style={styles.form}>
              <View style={styles.nameRow}>
                <View style={styles.nameField}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Jane"
                    placeholderTextColor="#b8b8c0"
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
                <View style={styles.nameField}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Doe"
                    placeholderTextColor="#b8b8c0"
                    value={lastName}
                    onChangeText={setLastName}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </View>
              </View>

              <Text style={[styles.label, styles.labelGap]}>Email</Text>
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

              <Text style={[styles.label, styles.labelGap]}>Phone number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (787) 000-0000"
                placeholderTextColor="#b8b8c0"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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

              <Text style={[styles.label, styles.labelGap]}>Confirm password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#b8b8c0"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                activeOpacity={0.85}>
                <Text style={styles.signUpButtonText}>Sign up</Text>
              </TouchableOpacity>

              <View style={styles.loginRow}>
                <Text style={styles.hasAccountText}>Already have an account?</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace('/login')}>
                  <Text style={styles.loginText}>Log in</Text>
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
  backBtn: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 2,
    alignSelf: 'flex-start',
  },
  backArrow: {
    fontSize: 34,
    color: '#12213b',
    fontWeight: '300',
    lineHeight: 38,
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
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2a2a2a',
    textAlign: 'center',
    marginBottom: 28,
  },
  form: {
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  nameField: {
    flex: 1,
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
  actions: {
    marginTop: 24,
    gap: 20,
  },
  signUpButton: {
    backgroundColor: '#f08c02',
    borderRadius: 50,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
  },
  loginRow: {
    alignItems: 'center',
    gap: 4,
  },
  hasAccountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2a2a2a',
  },
  loginText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b7fd4',
    textDecorationLine: 'underline',
  },
});
