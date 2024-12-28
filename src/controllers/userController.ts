import { Context } from "hono";
import { extractEmailFromToken } from "../utils/jwtParser";

export const createUser = async (c: Context) => {
  try {
    const { mail, name, photoUrl } = await c.req.json();

    const checkQuery = `SELECT COUNT(*) as count FROM Users WHERE mail = ?`;
    const checkResp = await c.env.DB.prepare(checkQuery).bind(mail).first();

    if (checkResp?.count > 0) {
      return c.json({ success: false, message: "Email already exists" }, 200); // 409 Conflict
    }

    const query = `INSERT INTO Users (mail, name, photoUrl) VALUES (?, ?, ?)`;
    await c.env.DB.prepare(query).bind(mail, name, photoUrl).run();
    return c.json({ success: true, message: "User created successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const getUserByMail = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
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
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
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
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const query = `DELETE FROM Users WHERE mail = ?`;
    await c.env.DB.prepare(query).bind(mail).run();
    return c.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};
