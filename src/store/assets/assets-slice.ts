import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CurrencyModel } from "@/models/currency-model";
import { AssetModel } from "@/models/asset-model";
import { IdbAssetsService } from "@/services/idb/services/idb-assets-service";
import apiStreamBinanceService from "@/services/api/services/api-stream-binance-service";
import apiMarketBinanceService from "@/services/api/services/api-market-binance-service";
import { BASE_CURRENCY } from "@/utils/constants";

interface AssetsState {
  assets: AssetModel[];
  currencies: Record<string, CurrencyModel>; // Normalized structure
  isAddAssetDialogOpened: boolean;
  areCurrenciesLoading: boolean;
}

const initialState: AssetsState = {
  assets: [],
  currencies: {},
  isAddAssetDialogOpened: false,
  areCurrenciesLoading: true,
};

export const fetchAssets = createAsyncThunk<AssetModel[] | null>(
  "assets/fetchAssets",
  async () => {
    try {
      return IdbAssetsService.getAll();
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const addAsset = createAsyncThunk<AssetModel | null, AssetModel>(
  "assets/addAsset",
  async (asset, { dispatch }) => {
    try {
      const existingAsset = await IdbAssetsService.getById(asset.name);
      const assetToSet = existingAsset
        ? {
            ...existingAsset,
            quantity: existingAsset.quantity + asset.quantity,
          }
        : asset;
      await IdbAssetsService.addOrUpdate([assetToSet]);
      await dispatch(fetchAssets());
      apiStreamBinanceService.subscribeToAssets(
        (await IdbAssetsService.getAll()).map((a) => a.name),
      );
      return assetToSet;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const removeAsset = createAsyncThunk<string | null, string>(
  "assets/removeAsset",
  async (assetName, { dispatch }) => {
    try {
      await IdbAssetsService.deleteById(assetName);
      await dispatch(fetchAssets());
      apiStreamBinanceService.subscribeToAssets(
        (await IdbAssetsService.getAll()).map((a) => a.name),
      );
      return assetName;
    } catch (e) {
      console.log(e);
      return null;
    }
  },
);

export const fetchCurrencies = createAsyncThunk<
  Record<string, CurrencyModel> | null,
  string | void
>("assets/fetchCurrencies", async (priceUnit) => {
  const unit = priceUnit || BASE_CURRENCY;
  try {
    const currenciesArray = await apiMarketBinanceService.getCurrenciesPairs();
    return currenciesArray
      .filter((c) => c.symbol.endsWith(unit))
      .reduce(
        (acc, c) => {
          acc[c.symbol.replace(unit, "")] = {
            name: c.symbol.replace(unit, ""),
            price: c.askPrice,
            changePercent: c.priceChangePercent,
          };
          return acc;
        },
        {} as Record<string, CurrencyModel>,
      );
  } catch (e) {
    console.log(e);
    return null;
  }
});

export const updateCurrencies = createAsyncThunk<
  CurrencyModel[],
  CurrencyModel[]
>("assets/updateCurrency", async (currencies) => currencies);

export const initApiStreamBinanceWebsocket = createAsyncThunk(
  "assets/initWebSocket",
  async (_, { dispatch }) => {
    apiStreamBinanceService.setUpdateCallback((currencies) => {
      dispatch(updateCurrencies(currencies));
    });
    const assets = await IdbAssetsService.getAll();
    const symbols = assets.map((c) => c.name);
    apiStreamBinanceService.subscribeToAssets(symbols);
  },
);

const assetsSlice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    assetsAddingDialogToggled: (state, action: { payload: boolean }) => {
      state.isAddAssetDialogOpened = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      if (action.payload !== null) {
        state.assets = action.payload;
      }
    });
    builder.addCase(fetchCurrencies.pending, (state) => {
      state.areCurrenciesLoading = true;
    });
    builder.addCase(fetchCurrencies.fulfilled, (state, action) => {
      state.areCurrenciesLoading = false;
      if (action.payload !== null) {
        state.currencies = action.payload;
      }
    });
    builder.addCase(updateCurrencies.fulfilled, (state, action) => {
      action.payload.forEach((currency) => {
        state.currencies[currency.name] = currency;
      });
    });
  },
});

export const { assetsAddingDialogToggled } = assetsSlice.actions;
export const assetsReducer = assetsSlice.reducer;
