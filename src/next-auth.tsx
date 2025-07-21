import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import axios from './axiosHelper';
import { removeData, saveData } from './storageHelper';

type SessionContextType = {
  data: any;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  signOut: (onSignOut: () => void) => Promise<void>;
};

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined,
);

type SessionProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
}) => {
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<
    'loading' | 'authenticated' | 'unauthenticated'
  >('loading');

  useEffect(() => {
    getSession()
      .then(res => {
        setData(res);
        setStatus('authenticated');
      })
      .catch(() => {
        setData(null);
        setStatus('unauthenticated');
      });
  }, []);
  const signOut = async (onSignOut: () => void) => {
    try {
      await removeData('sessionCookies');
      setData(null);
      setStatus('unauthenticated');
      onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <SessionContext.Provider
      value={{
        data,
        status,
        signOut,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within an SessionProvider');
  }
  return context;
};

export const signIn = async (options: object) => {
  try {
    const csrfResponse = await axios.get('/api/auth/csrf', {
      withCredentials: true,
    });
    const csrfToken = csrfResponse.data.csrfToken;
    const initialCookies = csrfResponse.headers['set-cookie'];
    const credentials = {
      ...options,
      csrfToken: csrfToken,
      callbackUrl: '/',
      redirect: false,
      json: true,
    };

    let callbackResponse: any = null;
    try {
      const callbackData = new URLSearchParams();
      Object.entries(credentials).forEach(([key, value]) => {
        callbackData.append(key, value.toString());
      });

      callbackResponse = await axios.post(
        '/api/auth/callback/credentials',
        callbackData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: initialCookies ? initialCookies.join('; ') : '',
          },
          withCredentials: true,
          maxRedirects: 0,
        },
      );
    } catch (error: any) {
      throw new Error(
        decodeURIComponent(error?.response?.data?.url?.split('error=')[1]),
      );
    }

    let sessionCookies = initialCookies ? [...initialCookies] : [];

    if (callbackResponse && callbackResponse.headers['set-cookie']) {
      const callbackCookies = callbackResponse.headers['set-cookie'];
      sessionCookies = [...sessionCookies, ...callbackCookies];
    }
    await saveData('sessionCookies', sessionCookies.join('; '));
    const sessionResponse = await getSession();
    if (sessionResponse) {
      return sessionResponse;
    }
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const getSession = async () => {
  try {
    const sessionResponse = await axios.get('/api/auth/session', {
      withCredentials: true,
    });
    await saveData('sessionCookies', sessionResponse.headers['set-cookie']);
    return sessionResponse.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.error || error.message);
  }
};
