import fetchWeatherData from "./fetchWeatherData.js";
import axios from "axios";

// jest.mock("axios", () => {
//   return {
//     get: jest.fn(() => {
//       return {
//         data: {
//           weather: [
//             {
//               id: 803,
//               main: "Clouds",
//               description: "broken clouds",
//               icon: "04n",
//             },
//           ],
//           main: {
//             temp: 269.64,
//             feels_like: 263.44,
//             temp_min: 267.72,
//             temp_max: 270.9,
//             pressure: 1011,
//             humidity: 76,
//           },
//         },
//       };
//     }),
//   };
// });

// beforeEach(() => {
//   jest.resetModules();
//   jest.clearAllMocks();
// });

// describe("fetchWeatherData", () => {
//   it("should access current temperature in city", async () => {
//     const apiKey = process.env.WEATHER_API_KEY;
//     const latitude = process.env.WEATHER_API_LAT;
//     const longitude = process.env.WEATHER_API_LONG;

//     expect(await fetchWeatherData({})).toEqual({
//       celsius: "-4.1",
//       fahrenheit: "24.5",
//       weatherType: "Clouds",
//     });
//     expect(axios.get).toHaveBeenCalledWith(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
//     );
//   });

//   it("should throw error on invalid API key", async () => {
//     jest.mock("axios", () => {
//       console.log("MOCKING AXIOS.GET");
//       return {
//         get: jest.fn(() => {
//           console.log("AXIOS.GET MOCK CALLED");
//           throw new Error("Error fetching temperature: Invalid API key");
//         }),
//       };
//     });

//     expect(jest.isMockFunction(axios.get)).toBe(true);

//     console.log("BEFORE CALLING FETCHWEATHERDATA");

//     await expect(fetchWeatherData({})).rejects.toThrow(
//       "Error fetching temperature: Invalid API key"
//     );
//   });

//   console.log("AFTER CALLING FETCHWEATHERDATA");

//   // expect(axios.get).toHaveBeenCalledWith(
//   //   expect.stringContaining(`&appid=${process.env.WEATHER_API_KEY}`)
//   // );
// });

describe("fetchWeatherData", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should access current temperature in city", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
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
    });

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

    // Remove the axios.get mock
    jest.restoreAllMocks();
  });

  it("should throw error fetching temperature", async () => {
    const incorrectApiKey = "abc";
    jest.mock("axios", () => {
      return {
        get: jest.fn(() => {
          throw new Error("Error fetching temperature");
        }),
      };
    });

    await expect(fetchWeatherData({})).rejects.toThrowError(
      "Error fetching temperature: Invalid API key"
    );

    // Remove the axios.get mock
    jest.restoreAllMocks();
  });
});
