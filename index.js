import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";
import "dotenv/config.js";

const app = express();
const port = 3000;

// -------------------------- //
// --------------- API PARAMS //
// -------------------------- //

const apiKey = process.env.WEATHER_API_KEY;
const latitude = 40.7128;
const longitude = -74.006;

// -------------------------- //
// ---------- DATABASE PARAMS //
// -------------------------- //

const pgPassword = process.env.PG_PASSWORD;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "todolistproj",
  password: pgPassword,
  port: 5432,
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

async function fetchWeatherData(req) {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );

    // v Displays basic string weather desc. (viz. "Clouds")
    const weatherType = response.data.weather[0].main;
    // data.weather[0].description more specific ("overcast clouds")

    // Perhaps add corresponding images to suit each weather type. Maybe store in an obj.

    const current_temp_k = parseInt(response.data.main.temp);

    const current_temp_f = ((current_temp_k - 273.15) * (9 / 5) + 32).toFixed(
      1
    );
    const current_temp_c = (current_temp_k - 273.15).toFixed(1);
    console.log(current_temp_f, current_temp_c, weatherType);
    //console.log("FUNCTION REQ: " + req.body);

    // Object created to store F and C data so it can be called in requests.
    // req precedes it to make it accessible in all further calls.
    req.weatherData = {
      fahrenheit: current_temp_f,
      celsius: current_temp_c,
      weatherType,
    };

    return req.weatherData;
  } catch (error) {
    throw new Error("Error fetching temperature: ", error);
  }
}

async function checkTasks() {
  const result = await db.query("SELECT task, priority FROM task_table");
  let taskList = [];
  let priorityList = [];
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

  console.log("TASK LIST LOCAL: " + taskList);
  console.log("PRIORITY LIST: " + priorityList);
  console.log("TASK OBJECT: ", taskObject);

  return taskList;
}

app.get("/", async (req, res) => {
  try {
    const taskList = await checkTasks();
    const weatherData = await fetchWeatherData(req);
    const { fahrenheit, celsius } = req.weatherData;

    res.render("index.ejs", {
      fahrenheit,
      celsius,
      tasks: taskList,
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.post("/", async (req, res) => {
  try {
    const taskList = await checkTasks();
    const weatherData = await fetchWeatherData(req);
    const { fahrenheit, celsius } = req.weatherData;

    const newTask = req.body.newTask;
    const taskPriority = req.body.priority;

    if (newTask.trim().length != 0) {
      try {
        const nextID = taskList.length;
        console.log(nextID);

        await db.query(
          "INSERT INTO task_table (id, task, priority) VALUES ($1, $2, $3)",
          [nextID, newTask, taskPriority]
        );
        return res.redirect("/");
      } catch (err) {
        return res
          .status(500)
          .json({ error: "Error adding task to the database." });
      }
    } else {
      console.log("ELSE POST: " + taskList);
      return res.render("index.ejs", {
        fahrenheit,
        celsius,
        tasks: taskList,
      });
    }
  } catch (err) {
    console.error("Error: ", err);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.delete("/delete-task/:taskText", async (req, res) => {
  const taskText = req.params.taskText;
  console.log("DELETE TASK ID: " + taskText);
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