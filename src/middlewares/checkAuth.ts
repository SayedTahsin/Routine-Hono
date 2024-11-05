import { verify } from "hono/jwt";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

export const checkAuth = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, "ROUTINEAPP");

    if (!token) {
      return c.json({ message: "Unauthorized: No token provided" }, 401);
    }

    const decoded = await verify(token, c.env.SECRET_KEY || "");

    c.set("user", decoded);

    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized: Invalid token" }, 401);
  }
};
