import styles from "./Landing.module.css";

export function Landing() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          ¡Hola, yo soy Jesús Manuel Hernández Zozaya!
        </h1>
      </main>
      <footer className={styles.footer}>Made in Mexico</footer>
    </div>
  );
}
