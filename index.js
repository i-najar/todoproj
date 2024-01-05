import express from "express";
import bodyParser from "body-parser";
import "dotenv/config.js";

const app = express();
const port = 3000;

// -------------------------- //
// ----------------- API INFO //
// -------------------------- //

// .env file
const api_key = process.env.WEATHER_API_KEY;
const latitude = 40.7128;
const longitude = -74.006;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// -------------------------- //
// --- FETCH WEATHER DATA --- //
// -------------------------- //

async function fetchWeatherData(req, res, next) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${api_key}`
    );
    const data = await response.json();

    const typeOfWeather = data.weather[0].main;
    // Can also do data.weather[0].description for specifics i.e. "overcast clouds"
    // Tally 'em and think of corresponding images to suit each one. Maybe store in an obj.
    const current_temp_k = data.main.temp;
    const current_temp_f = ((current_temp_k - 273.15) * (9 / 5) + 32).toFixed(
      1
    );
    const current_temp_c = (current_temp_k - 273.15).toFixed(1);
    console.log(current_temp_f, current_temp_c, typeOfWeather);

    // Object created to store F and C data so it can be called in requests.
    // req precedes it to make it accessible in all further calls.
    req.weatherData = {
      fahrenheit: current_temp_f,
      celsius: current_temp_c,
      typeOfWeather,
    };

    next();
  } catch (error) {
    console.error("Error fetching temperature:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching temperature." });
  }
}

const taskList = [];

app.get("/", fetchWeatherData, (req, res) => {
  const { fahrenheit, celsius } = req.weatherData;
  res.render("index.ejs", {
    fahrenheit,
    celsius,
    tasks: taskList,
  });
});

app.post("/", fetchWeatherData, (req, res) => {
  const { fahrenheit, celsius } = req.weatherData;
  // Form passes newTask here.
  const newTask = req.body.newTask;
  console.log(newTask.length);
  // This handles empty submissions, but not something like "_".
  if (newTask.length != 0) {
    taskList.push(newTask);
  } else {
  }
  // We append this variable to our list of tasks.

  res.render("index.ejs", {
    fahrenheit,
    celsius,
    // Lastly, we pass the variable back to our page for display.
    tasks: taskList,
  });
});

// Create a database to hold tasks
// Utilize the visitedCountriesChecker function to populate the task list
// When checking a task, delete it from the page? Maybe double click removes it from the database.
// Follow REST API in jsnotes2

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
