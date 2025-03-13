import { CurrencyModel } from "@/models/currency-model";
import styles from "./currency-item.module.css";
import cx from "classnames";
import { formatNumber } from "@/utils/utils";

export default function CurrencyItem(props: {
  currency: CurrencyModel;
  onClick: (currency: CurrencyModel) => void;
}) {
  return (
    <li
      className={styles.currencyItem}
      onClick={() => props.onClick(props.currency)}
    >
      <p>{props.currency.name}</p>
      <p>${formatNumber(+props.currency.price, 5)}</p>
      <p
        className={cx(styles.currencyItemPercent, {
          [styles.currencyItemPercent_negative]:
            props.currency.changePercent.startsWith("-"),
        })}
      >
        {formatNumber(+props.currency.changePercent)}%
      </p>
    </li>
  );
}
