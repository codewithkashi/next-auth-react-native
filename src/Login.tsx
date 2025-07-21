import React from 'react';
import { Button, View } from 'react-native';
import { getSession, signIn, useSession } from './next-auth';

const Login = () => {
  const { data: session, status, signOut } = useSession();
  console.log(session, status);
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          marginTop: 100,
        }}
        title="Login"
        onPress={() => {
          signIn({
            email: 'admin@test.com',
            password: 'password',
          });
        }}
      />
      <Button
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          marginTop: 100,
        }}
        title="Get Session"
        onPress={() => {
          getSession().then(res => {
            console.log(res);
          });
        }}
      />
      <Button
        style={{
          backgroundColor: 'blue',
          color: 'white',
          padding: 10,
          borderRadius: 5,
          marginTop: 100,
        }}
        title="Sign Out"
        onPress={() => {
          signOut(() => {
            console.log('Signed out');
          });
        }}
      />
    </View>
  );
};

export default Login;
