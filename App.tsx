/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { SessionProvider } from './src/next-auth';
import Login from './src/Login';

function App() {

  return (
    <SessionProvider>
      <Login />
    </SessionProvider>
  );
}

export default App;
