/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { SessionProvider } from 'nextauth-react-native';
import Login from './src/Login';

function App() {

  return (
    <SessionProvider baseURL='https://humrahi.net/'>
      <Login />
    </SessionProvider>
  );
}

export default App;
