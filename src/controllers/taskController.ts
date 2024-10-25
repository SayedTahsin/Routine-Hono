import { Context } from "hono";

export const createTask = async (c: Context) => {
  try {
    const { text, status = false, mail, category } = await c.req.json();
    const query = `INSERT INTO Tasks (text, status, mail, category) VALUES (?, ?, ?, ?)`;
    await c.env.DB.prepare(query).bind(text, status, mail, category).run();
    return c.json({ success: true, message: "Task created successfully" });
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};

export const getTasksByMail = async (c: Context) => {
  try {
    const { mail } = c.req.param();
    const query = `SELECT * FROM Tasks WHERE mail = ?`;
    const result = await c.env.DB.prepare(query).bind(mail).all();
    return c.json(result);
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};

export const updateTask = async (c: Context) => {
  try {
    const { id } = c.req.param();
    const { text, status, mail, category } = await c.req.json();

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

export const updateTasksByDay = async (c: Context) => {
  try {
    const today = new Date().toLocaleString("en-US", { weekday: "long" });

    const query = `UPDATE Tasks SET status = false WHERE category = ?`;
    await c.env.DB.prepare(query).bind(today).run();

    return c.json({
      success: true,
      message: `Tasks with category ${today} updated successfully`,
    });
  } catch (e) {
    return c.json({ success: false, message: e }, 500);
  }
};
