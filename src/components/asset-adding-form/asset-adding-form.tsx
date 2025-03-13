import Button from "@/components/button/button";
import CurrenciesList from "@/components/currencies-list/currencies-list";
import { CurrencyModel } from "@/models/currency-model";
import styles from "./asset-adding-form.module.css";
import { FormEvent, useEffect, useState } from "react";
import { AssetModel } from "@/models/asset-model";
import Input from "@/components/input/input";
import { formatNumber } from "@/utils/utils";

export default function AssetAddingForm(props: {
  currencies: Record<string, CurrencyModel>;
  onSubmit: (data: AssetModel) => void;
  onClose?: () => void;
  isOpened?: boolean;
}) {
  const [searchValue, setSearchValue] = useState("");
  const [currency, setCurrency] = useState<CurrencyModel | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  useEffect(() => {
    setSearchValue("");
    setCurrency(null);
    setQuantity(null);
  }, [props.isOpened]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (currency && quantity) {
      props.onSubmit({
        name: currency.name,
        quantity,
      });
    }
    if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <form className={styles.assetAddingForm} onSubmit={handleSubmit}>
      <Input
        placeholder="Поиск валюты"
        onChange={(e) => setSearchValue(e.target.value)}
        value={searchValue}
      />
      <CurrenciesList
        currencies={Object.values(props.currencies).filter((currency) =>
          currency.name.toLowerCase().includes(searchValue.toLowerCase()),
        )}
        onCurrencyClick={(currency) => setCurrency(currency)}
      />
      {currency && (
        <div className={styles.assetAddingFormData}>
          <div className={styles.assetAddingFormDataCurrency}>
            <p>{currency.name}</p>
            <p>${formatNumber(+currency.price)}</p>
          </div>
          <Input
            placeholder="Количество"
            step="1"
            min="1"
            max="1000"
            required
            type="number"
            value={quantity || ""}
            onChange={(e) => setQuantity(+e.target.value)}
          />
        </div>
      )}
      <div className={styles.assetAddingFormControls}>
        <Button type="submit" onClick={props.onClose}>
          Отмена
        </Button>
        <Button type="submit" disabled={!currency}>
          Добавить
        </Button>
      </div>
    </form>
  );
}
