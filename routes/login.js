import express from "express";
import dotenv from "dotenv";
import pg from "pg";
import path from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";

const { Pool } = pg;

const loginRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

loginRouter.use(express.urlencoded({ extended: true }));
loginRouter.use(express.static(path.join(__dirname, "../views")));

const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

loginRouter.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

loginRouter.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );

    if (result.rows.length > 0) {
      const hashedPassword = result.rows[0].password;
      const passwordMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordMatch) {
        res.redirect("/");
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }

    client.release();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(500).send("Internal Server Error");
  }
});

loginRouter.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

loginRouter.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  // console.log(req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)",
      [username, hashedPassword, email]
    );
    //console.log("PASSWORD TYPE:" + typeof password);

    res.redirect("/login");
    client.release();
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).send("Internal Server Error");
  }
});

export default loginRouter;
