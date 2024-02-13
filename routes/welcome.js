import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const welcomeRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

welcomeRouter.use(express.urlencoded({ extended: true }));
welcomeRouter.use(express.static(path.join(__dirname, "../views")));

welcomeRouter.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/welcome.html"));
});

export default welcomeRouter;
