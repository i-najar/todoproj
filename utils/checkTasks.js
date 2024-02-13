import db from "../database/postgres.database.js";

// import function that returns task_table name; that goes into result. Save it as a const.

async function checkTasks(username) {
  try {
    const result = await db.query(
      `SELECT task_table.task, task_table.priority, task_table.id
      FROM task_table
      JOIN users ON task_table.user_id = users.id
      WHERE users.username = $1`,
      [username]
    );
    //console.log("CHECKTASKS RESULT: ", result);
    let taskObject = {};

    result.rows.forEach((task) => {
      const priority = task.priority;
      const taskName = task.task;
      const taskId = task.id;
      if (!taskObject[priority]) {
        taskObject[priority] = [];
      }
      taskObject[priority].push({ [taskName]: taskId });
    });

    // console.log("TASK OBJECT: ", taskObject);
    return taskObject;
  } catch (error) {
    console.error("Error retrieving tasks: ", error);
    throw error;
  }
}

export default checkTasks;
