import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import "dotenv/config.js";
import fetchWeatherData from "./utils/fetchWeatherData.js";

const app = express();
const port = 3000;

// -------------------------- //
// --------------- API PARAMS //
// -------------------------- //

// :(

// -------------------------- //
// ---------- DATABASE PARAMS //
// -------------------------- //

const pgPassword = process.env.PG_PASSWORD;
const pgUsername = process.env.PG_USERNAME;
const pgHost = process.env.PG_HOST;
const pgDatabase = process.env.PG_DATABASE;
const pgPort = process.env.PG_PORT;

// make all params env
const db = new pg.Client({
  user: pgUsername,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
});
db.connect();

// -------------------------- //
// ------- EXPRESS FORMATTING //
// -------------------------- //

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// -------------------------- //
// --- FETCH WEATHER DATA --- //
// -------------------------- //

async function checkTasks() {
  const result = await db.query("SELECT task, priority FROM task_table");
  let taskList = [];
  let taskObject = {};

  result.rows.forEach((task) => {
    taskList.push(task.task);
    const priority = task.priority;
    const taskName = task.task;
    if (!taskObject[priority]) {
      taskObject[priority] = [];
    }
    taskObject[priority].push(taskName);
  });

  // console.log("TASK LIST LOCAL: " + taskList);
  console.log("TASK OBJECT: ", taskObject);

  // return taskList;
  return taskObject;
}

app.get("/", async (req, res) => {
  try {
    const taskObject = await checkTasks();
    const weatherData = await fetchWeatherData(req);
    const { fahrenheit, celsius } = req.weatherData;

    res.render("index.ejs", {
      fahrenheit,
      celsius,
      tasks: taskObject,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.post("/", async (req, res) => {
  try {
    const taskObject = await checkTasks();
    const weatherData = await fetchWeatherData(req);
    const { fahrenheit, celsius } = req.weatherData;

    const newTask = req.body.newTask;
    const taskPriority = req.body.priority;

    if (newTask.trim().length != 0) {
      try {
        await db.query(
          "INSERT INTO task_table (task, priority) VALUES ($1, $2)",
          [newTask, taskPriority]
        );
        return res.redirect("/");
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Error adding task to the database." });
      }
    } else {
      console.log("ELSE POST: " + taskObject);
      return res.render("index.ejs", {
        fahrenheit,
        celsius,
        tasks: taskObject,
      });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.delete("/delete-task/:taskText", async (req, res) => {
  const taskText = req.params.taskText;
  console.log("DELETE TASK: " + taskText);
  try {
    await db.query("DELETE FROM task_table WHERE task = $1", [taskText]);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error: ", error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
