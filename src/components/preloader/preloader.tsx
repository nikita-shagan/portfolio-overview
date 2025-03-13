import styles from "./preloader.module.css";

function Preloader({ size = 52 }) {
  return (
    <div className={styles.preloader} style={{ width: size, height: size }} />
  );
}

export default Preloader;
