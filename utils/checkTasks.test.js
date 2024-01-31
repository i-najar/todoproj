import checkTasks from "./checkTasks";
import pg from "pg";

jest.mock("pg");

describe("checkTasks", () => {
  it("should establish a database connection", async () => {
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

    const client = await db.connect();
    expect(client).toBeTruthy();
    client.release();
  });

  it("should query database for tasks and their priority levels", async () => {
    expect(await checkTasks()).toEqual({
      med: ["shouldbeMED"],
      low: ["shouldbeLOW"],
      high: ["Make ENV variables", "Unit test"],
    });
  });
});

// jest.mock("pg");

// describe("checkTasks", () => {
//   it("should establish a database connection and query for tasks", async () => {
//     const connectSpy = jest.spyOn(pg.Client.prototype, "connect");
//     jest.spyOn(pg.Client.prototype, "query").mockImplementation(() => ({
//       rows: [
//         { task: "shouldbeMED", priority: "med" },
//         { task: "shouldbeLOW", priority: "low" },
//         { task: "Make ENV variables", priority: "high" },
//         { task: "Unit test", priority: "high" },
//       ],
//     }));

//     await checkTasks();
//     expect(connectSpy).toHaveBeenCalled();
//     connectSpy.mockRestore();
//     pg.Client.prototype.query.mockRestore();
//   });
// });
