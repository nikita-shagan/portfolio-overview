import styles from "./asset-item.module.css";
import cx from "classnames";
import { AssetModel } from "@/models/asset-model";
import { formatNumber } from "@/utils/utils";

export default function AssetItem(props: {
  onClick: (asset: AssetModel) => void;
  data?: {
    name: string;
    quantity: number;
    price: number;
    totalPrice: number;
    changePercent: string;
    percentInPortfolio: number;
  };
}) {
  if (!props?.data?.name) {
    return null;
  }

  const data = props.data;

  return (
    <li className={styles.assetItem} onClick={() => props.onClick(data)}>
      <p>{data?.name}</p>
      <p>{data?.quantity}</p>
      <p>${formatNumber(+data?.price)}</p>
      <p>${formatNumber(+data?.totalPrice)}</p>
      <p
        className={cx(styles.assetItemPercent, {
          [styles.assetItemPercent_negative]:
            data?.changePercent.startsWith("-"),
        })}
      >
        {formatNumber(+data?.changePercent)}%
      </p>
      <p>{formatNumber(+data?.percentInPortfolio)}%</p>
    </li>
  );
}
