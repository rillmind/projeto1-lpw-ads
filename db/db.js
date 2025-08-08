import { open } from "sqlite";
import sqlite3 from "sqlite3";

export const dbPromise = open({
  filename: "./db/db.sqlite",
  driver: sqlite3.Database,
});
