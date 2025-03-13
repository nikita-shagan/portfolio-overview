"use client";
import styles from "./app-bar.module.css";
import Button from "@/components/button/button";

export default function AppBar(props: { onAddCurrencyClick: () => void }) {
  return (
    <div className={styles.appBar}>
      <div className={styles.appBarBody}>
        <h1 className={styles.appBarBodyTitle}>PORTFOLIO OVERVIEW</h1>
        <Button onClick={props.onAddCurrencyClick}>Добавить</Button>
      </div>
    </div>
  );
}
