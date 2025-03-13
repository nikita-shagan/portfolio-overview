import styles from "./assets-list.module.css";
import { AssetModel } from "@/models/asset-model";
import AssetItem from "@/components/asset-item/asset-item";
import { CurrencyModel } from "@/models/currency-model";
import EmptyContent from "@/components/empty-content/empty-content";
import Preloader from "@/components/preloader/preloader";
import { useMemo } from "react";

export default function AssetsList(props: {
  assets: AssetModel[];
  currencies: Record<string, CurrencyModel>;
  onAssetClick: (asset: AssetModel) => void;
  areCurrenciesLoading?: boolean;
}) {
  const totalPortfolioPrice = useMemo(() => {
    return props.assets.reduce(
      (acc, value) =>
        acc + value.quantity * +(props.currencies[value.name]?.price ?? ""),
      0,
    );
  }, [props.assets, props.currencies]);

  const assetsData = new Map(
    props.assets.map((asset: AssetModel) => {
      const assetCurrency = props.currencies[asset.name];
      const name = asset.name;
      const quantity = +asset.quantity;
      const price = +(assetCurrency?.price ?? "");
      const totalPrice = quantity * +price;
      const changePercent = assetCurrency?.changePercent ?? "";
      const percentInPortfolio = (totalPrice / totalPortfolioPrice) * 100;
      return [
        asset.name,
        {
          name,
          quantity,
          price,
          totalPrice,
          changePercent,
          percentInPortfolio,
        },
      ];
    }),
  );

  if (props.areCurrenciesLoading) {
    return (
      <EmptyContent>
        <Preloader />
      </EmptyContent>
    );
  }

  if (!props.assets.length) {
    return <EmptyContent>Нет активов</EmptyContent>;
  }

  return (
    <div className={styles.assetsList}>
      <div className={styles.assetsListBody}>
        <div className={styles.assetsListBodyHeading}>
          <p>Актив</p>
          <p>Количество</p>
          <p>Цена</p>
          <p>Общая стоимость</p>
          <p>Изм. за 24 ч.</p>
          <p>% портфеля</p>
        </div>
        <ul>
          {props.assets.map((asset) => (
            <AssetItem
              key={asset.name}
              onClick={props.onAssetClick}
              data={assetsData.get(asset.name)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
