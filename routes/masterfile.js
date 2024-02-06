import express from "express";
import dotenv from "dotenv";
import loginRouter from "./login.js";
import registerRouter from "./register.js";

const app = express();
const port = 3000;

dotenv.config({ path: "../.env" });

app.use(express.urlencoded({ extended: true }));
app.use(loginRouter);
app.use(registerRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
