import type { NextPage } from "next";
import Head from "next/head";
import { Landing } from "../components/Landing/Landing";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Hola, soy Jesus M!</title>
        <meta name="description" content="Welcome to jmherzo.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Landing />
    </>
  );
};

export default Home;
