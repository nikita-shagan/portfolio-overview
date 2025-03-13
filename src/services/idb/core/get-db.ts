import { IDBPDatabase, openDB } from "idb";

import { Stores } from "./stores";
import { ANON_USER_NAME } from "@/utils/constants";

type DbConnections = {
  [key: string]: Promise<IDBPDatabase>;
};

const dbConnections: DbConnections = {};
const dbVersion = 1;
const dbUpgrades = {
  upgrade(db: IDBPDatabase): void {
    if (!db.objectStoreNames.contains(Stores.ASSETS)) {
      db.createObjectStore(Stores.ASSETS);
    }
  },
};

export default function getDb(name?: string): Promise<IDBPDatabase> {
  const dbName = name || ANON_USER_NAME;
  if (!dbConnections[dbName]) {
    dbConnections[dbName] = openDB(dbName, dbVersion, dbUpgrades);
  }
  return dbConnections[dbName];
}
