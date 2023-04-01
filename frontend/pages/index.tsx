import Head from 'next/head';
import React, { ReactElement } from 'react';
import Layout from '../components/Layout/Layout';
import PasswordGenerator from '../components/PasswordGenerator/PasswordGenerator';

const Home = () => {
  return (
    <>
      <Head>
        <title>Home | Password manager</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PasswordGenerator />
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
