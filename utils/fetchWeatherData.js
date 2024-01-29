import axios from "axios";

const fetchWeatherData = async (req) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const latitude = process.env.WEATHER_API_LAT;
  const longitude = process.env.WEATHER_API_LONG;

  const apiLink = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

  try {
    const response = await axios.get(apiLink);
    console.log(response);
    // v Displays basic string weather desc. (viz. "Clouds")
    const weatherType = response.data.weather[0].main;
    // data.weather[0].description more specific ("overcast clouds")

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

    console.log("WEATHER DATA: " + req.weatherData);
    return req.weatherData;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching temperature: ", error);
  }
};

export default fetchWeatherData;
