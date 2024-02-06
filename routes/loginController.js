import pg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const pool = new Pool({
  user: process.env.PG_USERNAME,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

const loginController = {
  authenticateUser: async (req, res) => {
    const { username, password } = req.body;

    try {
      const client = await pool.connect();
      const result = await client.query(
        "SELECT * FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );

      if (result.rows.length > 0) {
        res.redirect("/index");
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }

      client.release();
    } catch (error) {
      console.error("Error during authentication:", error);
      res.status(500).send("Internal Server Error");
    }
  },

  registerUser: async (req, res) => {
    const { username, password, email } = req.body;

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
  },
};

export default loginController;
