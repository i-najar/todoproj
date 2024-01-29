import pg from "pg";

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
db.connect();

async function checkTasks() {
  const result = await db.query("SELECT task, priority FROM task_table");
  let taskList = [];
  let taskObject = {};

  result.rows.forEach((task) => {
    taskList.push(task.task);
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
