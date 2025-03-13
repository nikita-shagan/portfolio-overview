"use client";
import styles from "./page.module.css";
import AppBar from "@/components/app-bar/app-bar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Dialog from "@/components/dialog/dialog";
import AssetAddingForm from "@/components/asset-adding-form/asset-adding-form";
import {
  fetchCurrencies,
  assetsAddingDialogToggled,
  addAsset,
  fetchAssets,
  removeAsset,
  initApiStreamBinanceWebsocket,
} from "@/store/assets/assets-slice";
import { selectAssetsState } from "@/store/assets/selectors";
import { useEffect } from "react";
import AssetsList from "@/components/assets-list/assets-list";

export default function Home() {
  const dispatch = useAppDispatch();
  const { assets, currencies, isAddAssetDialogOpened, areCurrenciesLoading } =
    useAppSelector(selectAssetsState);

  useEffect(() => {
    dispatch(initApiStreamBinanceWebsocket());
    dispatch(fetchCurrencies());
    dispatch(fetchAssets());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <AppBar
        onAddCurrencyClick={() => dispatch(assetsAddingDialogToggled(true))}
      />
      <AssetsList
        assets={assets}
        currencies={currencies}
        onAssetClick={(asset) => dispatch(removeAsset(asset.name))}
        areCurrenciesLoading={areCurrenciesLoading}
      />
      <Dialog
        isOpened={isAddAssetDialogOpened}
        onClose={() => dispatch(assetsAddingDialogToggled(false))}
      >
        <AssetAddingForm
          currencies={currencies}
          onSubmit={(data) => dispatch(addAsset(data))}
          isOpened={isAddAssetDialogOpened}
          onClose={() => dispatch(assetsAddingDialogToggled(false))}
        />
      </Dialog>
    </div>
  );
}
