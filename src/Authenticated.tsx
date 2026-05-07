import { axios, signOut, useSession } from 'nextauth-react-native';
import { useEffect } from 'react';
import { SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, View, Text, TouchableOpacity } from 'react-native';
export default function Authenticated() {
    const { data: session , status }: any = useSession();
    useEffect(() => {
        const fetchProfiles = async () => {
          try {
            const response = await axios.post("/api/intrest/get-matching-profiles");
            console.log(response.data, "response of profiles matching");
          } catch (error: any) {
            console.log(error?.response?.data ?? error?.message ?? error, "error of profiles matching");
          }
        };
        fetchProfiles();
      }, []);
    //   show axios baseurl 
    console.log(axios.defaults.baseURL, "axios baseurl");
    return (
        
        <SafeAreaView className="flex-1 bg-background-light">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            className="flex-1"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 justify-center items-center px-6 py-8">
              {/* Success Header */}
              <View className="items-center mb-8">
                <View className="bg-gradient-to-br from-primary-400 to-primary-600 rounded-full w-28 h-28 items-center justify-center mb-4 shadow-lg">
                  <Text className="text-5xl">🍔</Text>
                </View>
                <Text className="text-3xl font-bold text-gray-800 mb-2">
                  TEZ
                </Text>
              </View>
              {/* User Info Card */}
              <View className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md border border-primary-100">
                <View className="items-center mb-6">
                  <View className="bg-success-100 rounded-full w-20 h-20 items-center justify-center mb-4">
                    <Text className="text-4xl">✓</Text>
                  </View>
                  <Text className="text-2xl font-bold text-gray-800 mb-2">
                    Welcome Back!
                  </Text>
                  <Text className="text-gray-600 text-center">
                    You are successfully signed in
                  </Text>
                </View>
                
                {session.user && (
                  <View className="bg-background-cream rounded-xl p-4 mb-6 border border-primary-100">
                    <Text className="text-sm text-primary-600 mb-1 font-semibold">Email</Text>
                    <Text className="text-base font-semibold text-gray-800">
                      {session.user.email || 'N/A'}
                    </Text>
                    {session.user.name && (
                      <>
                        <Text className="text-sm text-primary-600 mt-3 mb-1 font-semibold">Name</Text>
                        <Text className="text-base font-semibold text-gray-800">
                          {session.user.name}
                        </Text>
                      </>
                    )}
                  </View>
                )}
                
                <TouchableOpacity
                  onPress={() => signOut()}
                  className="bg-secondary-500 rounded-xl py-4 items-center shadow-lg active:scale-95"
                >
                  <Text className="text-white font-bold text-base">Sign Out</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
}