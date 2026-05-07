import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
  Keyboard,
  findNodeHandle,
} from 'react-native';
import { signIn, signOut, useSession } from '../auth';
import Authenticated from './Authenticated';
const Login = () => {
  const { data: session , status }: any = useSession();
  console.log(session);
  const [email, setEmail] = useState('zaid.rafiq.dev@gmail.com');
  const [password, setPassword] = useState('Test@123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordViewRef = useRef<View>(null);
  const emailViewRef = useRef<View>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await signIn({
        email,
        password,
        role: "ADMIN", 
        device_id: "1234567890", 
        fcm_token: "1234567890",
      });
      Alert.alert('Success', 'Signed in successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      Alert.alert('Error', err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignOut = () => {
    signOut(() => {
      Alert.alert('Success', 'Signed out successfully!');
    });
  };
  if (status === 'authenticated' && session) {
    return (
      <Authenticated />
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-background-light">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ 
            flexGrow: 1,
            justifyContent: isKeyboardVisible ? 'flex-start' : 'center',
            paddingTop: isKeyboardVisible ? 20 : 0,
            paddingBottom: 20
          }}
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center px-6">
            {/* Header Section with Food Theme */}
            <View className="items-center mb-8">
              <View className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-full w-28 h-28 items-center justify-center mb-4 shadow-lg">
                <Text className="text-5xl">🍔</Text>
              </View>
              <Text className="text-4xl font-bold text-primary-600 mb-2 tracking-tight">
                TEZ
              </Text>
              <Text className="text-gray-600 text-base font-medium">
                Delicious food at your doorstep
              </Text>
            
            </View>
            {/* Login Card */}
            <View className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md border border-primary-100">
              <View className="items-center mb-6">
                <Text className="text-2xl font-bold text-gray-800">
                  Sign In
                </Text>
                <Text className="text-sm text-gray-500 mt-1">
                  Enter your credentials to continue
                </Text>
              </View>
              {error ? (
                <View className="bg-error-50 border border-error-500 rounded-xl p-3 mb-4">
                  <Text className="text-error-600 text-sm text-center">{error}</Text>
                </View>
              ) : null}
              {status === 'loading' && !isLoading ? (
                <View className="py-8">
                  <ActivityIndicator size="large" color="#f97316" />
                  <Text className="text-center text-gray-600 mt-4">
                    Loading session...
                  </Text>
                </View>
              ) : (
                <>
                  <View ref={emailViewRef} className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </Text>
                    <View className="bg-background-light rounded-xl border-2 border-primary-200 focus:border-primary-500">
                      <TextInput
                        className="px-4 py-3 text-base text-gray-800"
                        placeholder="Enter your email"
                        placeholderTextColor="#d1d5db"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                        returnKeyType="next"
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                        blurOnSubmit={false}
                        onFocus={() => {
                          setTimeout(() => {
                            emailViewRef.current?.measureLayout(
                              findNodeHandle(scrollViewRef.current) as number,
                              (x, y) => {
                                scrollViewRef.current?.scrollTo({
                                  y: Math.max(0, y - 150),
                                  animated: true,
                                });
                              },
                              () => {}
                            );
                          }, 250);
                        }}
                      />
                    </View>
                  </View>
                  <View ref={passwordViewRef} className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </Text>
                    <View className="bg-background-light rounded-xl border-2 border-primary-200 focus:border-primary-500">
                      <TextInput
                        ref={passwordInputRef}
                        className="px-4 py-3 text-base text-gray-800"
                        placeholder="Enter your password"
                        placeholderTextColor="#d1d5db"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        editable={!isLoading}
                        returnKeyType="done"
                        onSubmitEditing={() => {
                          Keyboard.dismiss();
                          handleSignIn();
                        }}
                        onFocus={() => {
                          setTimeout(() => {
                            passwordViewRef.current?.measureLayout(
                              findNodeHandle(scrollViewRef.current) as number,
                              (x, y) => {
                                scrollViewRef.current?.scrollTo({
                                  y: y - 50,
                                  animated: true,
                                });
                              },
                              () => {}
                            );
                          }, 250);
                        }}
                      />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={handleSignIn}
                    disabled={isLoading}
                    className={`rounded-xl py-4 items-center shadow-lg mb-4 ${
                      isLoading
                        ? 'bg-primary-300'
                        : 'bg-primary-500 active:scale-95'
                    }`}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-bold text-base">
                        Sign In
                      </Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity className="items-center">
                    <Text className="text-primary-600 text-sm font-semibold">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
            {/* Footer */}
            <View className="mt-8 items-center">
              <Text className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <Text className="font-bold text-primary-600">Sign Up</Text>
              </Text>
              <View className="mt-4 bg-primary-50 rounded-full px-6 py-2 border border-primary-200">
                <Text className="text-primary-600 text-xs font-medium">
                  🎉 Get 20% off on your first order!
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default Login;
