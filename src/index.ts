import { Hono } from "hono";
import taskRoutes from "./routes/taskRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { checkAuth } from "./middlewares/checkAuth";

type Bindings = {
  DB: D1Database;
  SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("/api/tasks/*", checkAuth);
app.use("/api/notes/*", checkAuth);
app.use("/api/users/*", checkAuth);

app.route("/api/tasks", taskRoutes);
app.route("/api/notes", noteRoutes);
app.route("/api/users", userRoutes);
app.route("/auth", authRoutes);

app.get("/", (c) => {
  return c.text("Lets Go");
});

export default app;
