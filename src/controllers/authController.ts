import { sign } from "hono/jwt";
import { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";

export const login = async (c: Context) => {
  try {
    const { mail, id } = await c.req.json();
    const payload = {
      mail,
      id,
      exp: Math.floor(Date.now() / 1000) + 60 * 4320,
    };
    const secret = c.env.SECRET_KEY || "";
    const token = await sign(payload, secret);
    setCookie(c, "ROUTINEAPP", token, {
      secure: true,
      httpOnly: true,
    });

    return c.json("Log in Successfull", 201);
  } catch (error) {
    return c.json({ message: "cannot login", error }, 500);
  }
};

export const logout = (c: Context) => {
  deleteCookie(c, "ROUTINEAPP");
  return c.json("Logged out Successfully", 200);
};
