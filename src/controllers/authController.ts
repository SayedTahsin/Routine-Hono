import { sign } from "hono/jwt";
import { Context } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";

export const login = async (c: Context) => {
  try {
    const { mail } = await c.req.json();
    const payload = {
      mail,
    };
    const secret = c.env.SECRET_KEY || "n9bac021r1092nfq0912#123t12D$N029103";
    const token = await sign(payload, secret);
    setCookie(c, "ROUTINEAPP", token, {
      secure: true,
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "None",
      domain: c.env.ENV === "production" ? c.env.COOKIE_DOMAIN : "localhost",
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
