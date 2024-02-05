import express from "express";
import bodyParser from "body-parser";
import db from "../database/postgres.database.js";
import fetchWeatherData from "../utils/fetchWeatherData.js";
import checkTasks from "../utils/checkTasks.js";

const router = express.Router();

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
