import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import loginController from "./loginController.js";

const loginRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

loginRouter.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/login.html"));
});

loginRouter.post("/auth", loginController.authenticateUser);

export default loginRouter;
