import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import fetchWeatherData from "../utils/fetchWeatherData.js";

const router = express.Router();

const pgPassword = process.env.PG_PASSWORD;
const pgUsername = process.env.PG_USERNAME;
const pgHost = process.env.PG_HOST;
const pgDatabase = process.env.PG_DATABASE;
const pgPort = process.env.PG_PORT;

const db = new pg.Client({
  user: pgUsername,
  host: pgHost,
  database: pgDatabase,
  password: pgPassword,
  port: pgPort,
});
db.connect();

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

  console.log("TASK OBJECT: ", taskObject);

  return taskObject;
}

// make sep files vvv
// calling right functions; using the right arguments
// mutation + end-to-end testing

router.get("/", async (req, res) => {
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

router.post("/", async (req, res) => {
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

router.delete("/delete-task/:taskText", async (req, res) => {
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

export default router;
