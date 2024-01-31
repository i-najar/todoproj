import pg from "pg";

const pgPassword = process.env.PG_PASSWORD;
const pgUsername = process.env.PG_USERNAME;
const pgHost = process.env.PG_HOST;
const pgDatabase = process.env.PG_DATABASE;
const pgPort = process.env.PG_PORT;

const db = new pg.Client({
  user: pgUsername,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
});
db.connect();

export default db;
