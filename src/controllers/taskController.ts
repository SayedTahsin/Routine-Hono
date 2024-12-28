import { Context } from "hono";
import { extractEmailFromToken } from "../utils/jwtParser";

export const createTask = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const { text, status = false, category } = await c.req.json();
    const query = `INSERT INTO Tasks (text, status, mail, category) VALUES (?, ?, ?, ?)`;
    await c.env.DB.prepare(query).bind(text, status, mail, category).run();
    return c.json({ success: true, message: "Task created successfully" });
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};

export const getTasksByMail = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const query = `SELECT * FROM Tasks WHERE mail = ?`;
    const result = await c.env.DB.prepare(query).bind(mail).all();
    return c.json(result);
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};

export const updateTask = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const { id } = c.req.param();
    const { text, status, category } = await c.req.json();

    const query = `
    UPDATE Tasks 
    SET 
      text = COALESCE(?, text),
      status = COALESCE(?, status),
      mail = COALESCE(?, mail),
      category = COALESCE(?, category)
    WHERE id = ?
  `;

    await c.env.DB.prepare(query)
      .bind(text ?? null, status ?? null, mail ?? null, category ?? null, id)
      .run();

    return c.json({ success: true, message: "Task updated successfully" });
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};

export const deleteTask = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const query = `DELETE FROM Tasks WHERE id = ?`;
    await c.env.DB.prepare(query).bind(id).run();
    return c.json({ success: true, message: "Task deleted successfully" });
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};

export const updateTasksByDay = async (DB: D1Database) => {
  try {
    const today = new Date();
    const dayName = today
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const userMailsQuery = `SELECT DISTINCT mail FROM Tasks WHERE category = ?`;
    const userMails = await DB.prepare(userMailsQuery).bind(dayName).all();

    for (const user of userMails.results) {
      const mail = user.mail;

      const completedTasksQuery = `SELECT COUNT(*) AS completedCount FROM Tasks WHERE mail = ? AND category = ? AND status = true`;
      const completedTasksResult = await DB.prepare(completedTasksQuery)
        .bind(mail, dayName)
        .first();
      const completedTasks = Number(completedTasksResult?.completedCount) || 0;

      const totalTasksQuery = `SELECT COUNT(*) AS totalCount FROM Tasks WHERE mail = ? AND category = ?`;
      const totalTasksResult = await DB.prepare(totalTasksQuery)
        .bind(mail, dayName)
        .first();
      const totalTasks = Number(totalTasksResult?.totalCount) || 0;

      const currentUserStatsQuery = `SELECT completedTasks, totalTasks FROM Users WHERE mail = ?`;
      const currentUserStats = await DB.prepare(currentUserStatsQuery)
        .bind(mail)
        .first();
      const previousCompletedTasks =
        Number(currentUserStats?.completedTasks) || 0;
      const previousTotalTasks = Number(currentUserStats?.totalTasks) || 0;

      const newCompletedTasks = previousCompletedTasks + completedTasks;
      const newTotalTasks = previousTotalTasks + totalTasks;

      const updateUserQuery = `UPDATE Users SET completedTasks = ?, totalTasks = ? WHERE mail = ?`;
      await DB.prepare(updateUserQuery)
        .bind(newCompletedTasks, newTotalTasks, mail)
        .run();
    }

    const weekdays = [
      "SATURDAY",
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
    ];
    if (dayName === "FRIDAY") {
      weekdays.forEach(async (day) => {
        const updateTasksQuery = `UPDATE Tasks SET status = false WHERE category = ?`;
        await DB.prepare(updateTasksQuery).bind(day).run();
      });
    }
    return {
      success: true,
      message: `User task statistics and task statuses for category ${dayName} updated successfully.`,
    };
  } catch (e) {
    return { success: false, message: e };
  }
};
