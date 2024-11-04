import { Hono } from "hono";
import taskRoutes from "./routes/taskRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { updateTasksByDay } from "./controllers/taskController";
import { checkAuth } from "./middlewares/checkAuth";

type Bindings = {
  DB: D1Database;
  SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", async (c, next) => {
  await next();
  c.header("Access-Control-Allow-Origin", "http://localhost:5173");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type");
});

app.use("/api/tasks/*", checkAuth);
app.use("/api/notes/*", checkAuth);

app.route("/api/tasks", taskRoutes);
app.route("/api/notes", noteRoutes);
app.route("/api/users", userRoutes);
app.route("/auth", authRoutes);

app.get("/", (c) => {
  return c.text("Lets Go");
});

export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(updateTasksByDay(env.DB));
  },
};
