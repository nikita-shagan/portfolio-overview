import { CurrencyModel } from "@/models/currency-model";
import styles from "./currencies-list.module.css";
import CurrencyItem from "@/components/currency-item/currency-item";

export default function CurrenciesList(props: {
  currencies: CurrencyModel[];
  onCurrencyClick: (currency: CurrencyModel) => void;
}) {
  return (
    <ul className={styles.currenciesList}>
      {props.currencies.map((currency) => (
        <CurrencyItem
          key={currency.name}
          currency={currency}
          onClick={props.onCurrencyClick}
        />
      ))}
    </ul>
  );
}
