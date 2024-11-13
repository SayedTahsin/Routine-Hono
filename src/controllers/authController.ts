import { sign } from "hono/jwt";
import { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";

export const login = async (c: Context) => {
  try {
    const { mail } = await c.req.json();
    const payload = {
      mail,
    };
    const secret = c.env.SECRET_KEY || "";
    const token = await sign(payload, secret);
    setCookie(c, "ROUTINEAPP", token, {
      secure: true,
      httpOnly: false,
      expires: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
      path: "/",
      sameSite: "None",
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
