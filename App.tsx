/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { SessionProvider } from './src/next-auth';
import Login from './src/Login';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SessionProvider>
      <Login />
    </SessionProvider>
  );
}

export default App;
