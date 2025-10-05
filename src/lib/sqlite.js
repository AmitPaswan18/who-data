import Database from "better-sqlite3";

export const sqliteDb = new Database("who.db", { readonly: true });
