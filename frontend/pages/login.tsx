import Head from 'next/head';
import React, { ReactElement } from 'react';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/LoginForm/LoginForm';

const Login = () => {
  return (
    <>
      <Head>
        <title>Login | Password manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginForm />
    </>
  );
};

Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Login;
