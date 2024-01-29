import checkTasks from "./checkTasks";

describe("checkTasks", () => {
  it("should query database for tasks and their priority levels", async () => {
    expect(await checkTasks()).toEqual({
      med: ["shouldbeMED"],
      low: ["shouldbeLOW"],
      high: ["Make ENV variables", "Unit test"],
    });
  });
});
