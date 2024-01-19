import fetchWeatherData from "./fetchWeatherData.js";

// const fetchWeatherData = require("./fetchWeatherData");

describe("fetchWeatherData", () => {
  it("should access current temperature in city", async () => {
    expect(await fetchWeatherData({})).toEqual({
      celsius: "-1.1",
      fahrenheit: "29.9",
      weatherType: "Clouds",
    });
  });
});
