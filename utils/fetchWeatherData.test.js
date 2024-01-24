import fetchWeatherData from "./fetchWeatherData.js";
import axios from "axios";

jest.mock("axios", () => {
  return {
    get: jest.fn(() => {
      return {
        data: {
          weather: [
            {
              id: 803,
              main: "Clouds",
              description: "broken clouds",
              icon: "04n",
            },
          ],
          main: {
            temp: 269.64,
            feels_like: 263.44,
            temp_min: 267.72,
            temp_max: 270.9,
            pressure: 1011,
            humidity: 76,
          },
        },
      };
    }),
  };
});

describe("fetchWeatherData", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should access current temperature in city", async () => {
    const apiKey = process.env.WEATHER_API_KEY;
    const latitude = process.env.WEATHER_API_LAT;
    const longitude = process.env.WEATHER_API_LONG;
    expect(await fetchWeatherData({})).toEqual({
      celsius: "-4.1",
      fahrenheit: "24.5",
      weatherType: "Clouds",
    });
    expect(axios.get).toHaveBeenCalledWith(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
    );
  });

  it("should throw error fetching temperature", async () => {
    jest.mock("axios", () => {
      return {
        get: jest.fn(() => {
          throw new Error("Error fetching temperature");
        }),
      };
    });

    try {
      await fetchWeatherData();
    } catch (error) {
      console.error("Error caught: ", error.message);
      expect(error.message).toBe("Error fetching temperature: ");
    }
  });
});
