import styles from "./empty-content.module.css";
import { ReactNode } from "react";

function EmptyContent(props: { children?: ReactNode }) {
  return <div className={styles.emptyContent}>{props.children}</div>;
}

export default EmptyContent;
