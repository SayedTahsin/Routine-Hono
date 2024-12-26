import { Hono } from "hono";
import taskRoutes from "./routes/taskRoutes";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import { updateTasksByDay } from "./controllers/taskController";
// import { checkAuth } from "./middlewares/checkAuth";
import { cors } from "hono/cors";
import { secureHeaders } from "hono/secure-headers";
import { prettyJSON } from "hono/pretty-json";

type Bindings = {
  DB: D1Database;
  SECRET_KEY: string;
  FRONT_END_URL: string;
  FRONT_END_URL_DEV: string;
  ENV: string;
  COOKIE_DOMAIN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
  "*",
  cors({
    origin: (_, c) =>
      c.env.ENV === "development"
        ? c.env.FRONT_END_URL_DEV
        : c.env.FRONT_END_URL,
    credentials: true,
  })
);

app.use(secureHeaders());
app.use(prettyJSON());

// app.use("/api/tasks/*", checkAuth);
// app.use("/api/notes/*", checkAuth);

app.route("/api/tasks", taskRoutes);
app.route("/api/notes", noteRoutes);
app.route("/api/users", userRoutes);
app.route("/auth", authRoutes);

app.get("/", (c) => {
  return c.html(`<a href="https://routine-lemon.vercel.app/routine">UI</a>`);
});

export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
  async scheduled(event: ScheduledEvent, env: Bindings, ctx: ExecutionContext) {
    ctx.waitUntil(updateTasksByDay(env.DB));
  },
};
