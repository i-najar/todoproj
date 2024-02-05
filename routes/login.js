import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../views")));

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

app.post("/auth", async (req, res) => {});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

app.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  console.log(typeof password);
  console.log(req.body);

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, password, email]
    );
    console.log("PASSWORD TYPE:" + typeof password);

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
