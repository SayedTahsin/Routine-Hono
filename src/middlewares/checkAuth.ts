import { verify } from "hono/jwt";
import { Context, Next } from "hono";
import { getCookie } from "hono/cookie";

export const checkAuth = async (c: Context, next: Next) => {
  try {
    const token = getCookie(c, "ROUTINEAPP");

    if (!token) {
      return c.json({ message: "Unauthorized: No token provided" }, 401);
    }
    const decoded = await verify(
      token,
      c.env.SECRET_KEY || "n9bac021r1092nfq0912#123t12D$N029103"
    );

    c.set("user", decoded);

    await next();
  } catch (error) {
    return c.json({ message: "Unauthorized: Invalid token" }, 401);
  }
};
