import express from "express";
import db from "../database/postgres.database.js";

const loginRouter = express.Router();

loginRouter.get("/login", (req, res) => {
  console.log(req.body);
});
