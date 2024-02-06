import express from "express";
import bodyParser from "body-parser";
import "dotenv/config.js";
import loginRouter from "./routes/login.js";
import tasksRouter from "./routes/tasks.js";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/", loginRouter);
app.use("/", tasksRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
