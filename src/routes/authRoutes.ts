import { Hono } from "hono";
import { login, logout } from "../controllers/authController";

const authRoutes = new Hono();

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);

export default authRoutes;
