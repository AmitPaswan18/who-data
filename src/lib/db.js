import Database from "better-sqlite3";

export const db = new Database("who.db", { readonly: true });

export function closeDb() {
  db.close();
}
