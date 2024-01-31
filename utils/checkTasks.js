import db from "../database/postgres.database.js";

async function checkTasks() {
  const result = await db.query("SELECT task, priority FROM task_table");
  console.log("CHECKTASKS RESULT: ", result);
  let taskObject = {};

  result.rows.forEach((task) => {
    const priority = task.priority;
    const taskName = task.task;
    if (!taskObject[priority]) {
      taskObject[priority] = [];
    }
    taskObject[priority].push(taskName);
  });

  console.log("TASK OBJECT: ", taskObject);
  return taskObject;
}

export default checkTasks;
