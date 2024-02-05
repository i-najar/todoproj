import db from "../database/postgres.database.js";

// import function that returns task_table name; that goes into result. Save it as a const.

async function checkTasks() {
  const result = await db.query("SELECT task, priority FROM task_table");
  //console.log("CHECKTASKS RESULT: ", result);
  let taskObject = {};

  result.rows.forEach((task) => {
    const priority = task.priority;
    const taskName = task.task;
    if (!taskObject[priority]) {
      taskObject[priority] = [];
    }
    taskObject[priority].push(taskName);
  });

  // console.log("TASK OBJECT: ", taskObject);
  return taskObject;
}

export default checkTasks;
