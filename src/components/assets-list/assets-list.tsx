import styles from "./assets-list.module.css";
import { AssetModel } from "@/models/asset-model";
import AssetItem from "@/components/asset-item/asset-item";
import { CurrencyModel } from "@/models/currency-model";
import EmptyContent from "@/components/empty-content/empty-content";
import Preloader from "@/components/preloader/preloader";
import { useMemo } from "react";
import { FixedSizeList as List } from "react-window";

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
          <p>Кол-во</p>
          <p>Цена</p>
          <p>Стоимость</p>
          <p>Изм. за 24 ч.</p>
          <p>% портфеля</p>
        </div>
        <List
          height={1000}
          itemCount={props.assets.length}
          itemSize={50}
          width="100%"
        >
          {({ index, style }) => {
            const asset = props.assets[index];
            return (
              <div style={style}>
                <AssetItem
                  key={asset.name}
                  onClick={props.onAssetClick}
                  data={assetsData.get(asset.name)}
                />
              </div>
            );
          }}
        </List>
      </div>
    </div>
  );
}
