import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import loginController from "./loginController.js";

const registerRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

registerRouter.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/register.html"));
});

registerRouter.post("/register", loginController.registerUser);

export default registerRouter;
