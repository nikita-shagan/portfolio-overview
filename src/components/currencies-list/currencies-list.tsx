import React from "react";
import { FixedSizeList as List } from "react-window";
import { CurrencyModel } from "@/models/currency-model";
import styles from "./currencies-list.module.css";
import CurrencyItem from "@/components/currency-item/currency-item";

export default function CurrenciesList(props: {
  currencies: CurrencyModel[];
  onCurrencyClick: (currency: CurrencyModel) => void;
}) {
  return (
    <div className={styles.currenciesList}>
      <List
        height={400}
        itemCount={props.currencies.length}
        itemSize={50}
        width="100%"
      >
        {({ index, style }) => {
          const currency = props.currencies[index];
          return (
            <div style={style}>
              <CurrencyItem
                key={currency.name}
                currency={currency}
                onClick={props.onCurrencyClick}
              />
            </div>
          );
        }}
      </List>
    </div>
  );
}
