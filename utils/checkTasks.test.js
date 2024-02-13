import checkTasks from "./checkTasks";
// import pg from "pg";

// jest.mock("pg");

describe("checkTasks", () => {
  // it("should establish a database connection", async () => {
  //   const connectSpy = jest.spyOn(pg.Client.prototype, "connect");
  //   await checkTasks();
  //   expect(connectSpy).toHaveBeencalled();
  //   connectSpy.mockRestore();
  // });

  it("should query database for tasks and their priority levels", async () => {
    expect(await checkTasks()).toEqual({
      med: ["shouldbeMED"],
      low: ["shouldbeLOW"],
      high: ["Make ENV variables", "Unit test"],
    });
  });
});
