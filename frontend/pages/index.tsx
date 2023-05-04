import Head from 'next/head';
import React, { ReactElement, useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import PasswordGenerator from '../components/PasswordGenerator/PasswordGenerator';
import { IAuthState, IUser } from '../types';
import LoginForm from '../components/LoginForm/LoginForm';
import Column from '../components/FlexWrappers/Column';
import CredentialListing from '../components/CredentialListing/CredentialListing';

const Home = () => {
  const [authState, setAuthState] = useState<IAuthState>({
    authenticated: false
  });
  const [user, setUser] = useState<IUser | null>(null);

  const [clientLoaded, setClientLoaded] = useState<boolean>(false);

  useEffect(() => {
    setClientLoaded(true);
  }, []);

  useEffect(() => {
    if (clientLoaded && user) {
      setAuthState({
        authenticated: true
      });
    } else {
      setAuthState({
        authenticated: false
      });
    }
  }, [clientLoaded, user]);

  return (
    <>
      <Head>
        <title>Home | Password manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Column gap={'40px'}>
        <PasswordGenerator />
        {authState.authenticated && user && (
          <CredentialListing setUser={setUser} user={user} />
        )}
        {!authState.authenticated && (
          <LoginForm setAuthState={setAuthState} setUser={setUser} />
        )}
      </Column>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
