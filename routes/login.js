import express from "express";
import pg from "pg";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const { Pool } = pg;

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.post("/auth", async (req, res) => {});

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "../views/register.html");
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  console.log(req.body);

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, password, email]
    );

    res.redirect("/login");
    client.release();
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
