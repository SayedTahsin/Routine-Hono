import { Context } from "hono";
import { extractEmailFromToken } from "../utils/jwtParser";

export const createNote = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const { text, color = "White" } = await c.req.json();
    const query = `INSERT INTO Notes (text, mail, color) VALUES (?, ?, ?)`;
    await c.env.DB.prepare(query).bind(text, mail, color).run();
    return c.json({ success: true, message: "Note created successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const getNotesByMail = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const query = `SELECT * FROM Notes WHERE mail = ?`;
    const result = await c.env.DB.prepare(query).bind(mail).all();
    return c.json(result);
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const updateNote = async (c: Context) => {
  try {
    const authHeader = c.req.header("Authorization") || "";
    const mail = extractEmailFromToken(authHeader);
    if (!mail) {
      return c.json({ success: false, message: "Authentication Failed" }, 401);
    }
    const { id } = c.req.param();
    const { text, color } = await c.req.json();
    const query = `UPDATE Notes SET text = COALESCE(?, text), mail = COALESCE(?, mail), color = COALESCE(?, color) WHERE id = ?`;
    await c.env.DB.prepare(query)
      .bind(text ?? null, mail ?? null, color ?? null, id)
      .run();
    return c.json({ success: true, message: "Note updated successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};

export const deleteNote = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const query = `DELETE FROM Notes WHERE id = ?`;
    await c.env.DB.prepare(query).bind(id).run();
    return c.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    return c.json({ success: false, message: error }, 500);
  }
};
