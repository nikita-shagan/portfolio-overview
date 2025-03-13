import { IDBPDatabase } from "idb";
import { Stores } from "../core/stores";
import getDb from "../core/get-db";
import { AssetModel } from "@/models/asset-model";

export class IdbAssetsService {
  public static async addOrUpdate(
    assets: AssetModel[],
    dbName?: string,
  ): Promise<void> {
    if (!assets?.length) {
      return;
    }
    const db: IDBPDatabase = await getDb(dbName);
    const tx = db.transaction(Stores.ASSETS, "readwrite");
    const putPromises = assets.map((asset) => tx.store.put(asset, asset.name));
    await Promise.all([...putPromises, tx.done]);
  }

  public static async getAll(dbName?: string): Promise<AssetModel[]> {
    const db: IDBPDatabase = await getDb(dbName);
    return await db.getAll(Stores.ASSETS);
  }

  public static async getById(
    id: string,
    dbName?: string,
  ): Promise<AssetModel | null> {
    const db: IDBPDatabase = await getDb(dbName);
    return (await db.get(Stores.ASSETS, id)) ?? null;
  }

  public static async deleteById(id: string, dbName?: string): Promise<void> {
    const db: IDBPDatabase = await getDb(dbName);
    await db.delete(Stores.ASSETS, id);
  }
}
