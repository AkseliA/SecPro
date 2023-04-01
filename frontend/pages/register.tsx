import Head from 'next/head';
import React, { ReactElement } from 'react';
import Layout from '../components/Layout/Layout';
import RegisterForm from '../components/RegisterForm/RegisterForm';

const Register = () => {
  return (
    <>
      <Head>
        <title>Register | Password manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <RegisterForm />
    </>
  );
};

Register.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Register;
