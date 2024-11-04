import { Hono } from "hono";
import taskRoutes from "./routes/taskRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { updateTasksByDay } from "./controllers/taskController";
import { checkAuth } from "./middlewares/checkAuth";
import { cors } from "hono/cors";

type Bindings = {
  DB: D1Database;
  SECRET_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["X-Custom-Header", "Upgrade-Insecure-Requests"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

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
