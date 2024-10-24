import { Context } from "hono";

export const createUser = async (c: Context) => {
  try {
    const { mail, name } = await c.req.json();
    const query = `INSERT INTO Users (mail, name) VALUES (?, ?)`;
    await c.env.DB.prepare(query).bind(mail, name).run();
    return c.json({ success: true, message: "User created successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const getUserByMail = async (c: Context) => {
  try {
    const { mail } = c.req.param();
    const query = `SELECT * FROM Users WHERE mail = ?`;
    const result = await c.env.DB.prepare(query).bind(mail).first();
    if (result) {
      return c.json(result);
    }
    return c.json({ error: "User not found" }, 404);
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const updateUser = async (c: Context) => {
  try {
    const { mail } = c.req.param();
    const { name, completedTasks, totalTasks } = await c.req.json();
    const query = `UPDATE Users SET mail = COALESCE(?, mail), name = COALESCE(?, name), completedTasks = COALESCE(?, completedTasks), totalTasks = COALESCE(?, totalTasks) WHERE mail = ?`;
    await c.env.DB.prepare(query)
      .bind(
        mail ?? null,
        name ?? null,
        completedTasks ?? null,
        totalTasks ?? null,
        mail
      )
      .run();
    return c.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const deleteUser = async (c: Context) => {
  try {
    const { mail } = c.req.param();
    const query = `DELETE FROM Users WHERE mail = ?`;
    await c.env.DB.prepare(query).bind(mail).run();
    return c.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};
