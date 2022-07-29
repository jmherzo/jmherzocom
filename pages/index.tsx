import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Bienvenido a jmherzo</title>
        <meta name="description" content="Welcome to jmherzo.com" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>
          ¡Bienvenidos, yo soy Jesús Manuel Hernández Zozaya!
        </h1>
      </main>
      <footer className={styles.footer}>Made in Mexico</footer>
    </div>
  );
};

export default Home;
