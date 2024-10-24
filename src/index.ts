import { Hono } from "hono";

import taskRoutes from "./routes/taskRoutes";
// import noteRoutes from "./routers/noteRoutes";
// import userRoutes from "./routers/userRoutes";
// import authRoutes from "./routers/authRoutes";
// import { checkAuth } from "./middlewares/checkAuth";

type Bindings = {
  DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// app.use("/api/tasks/*", checkAuth);
// app.use("/api/notes/*", checkAuth);
// app.use("/api/users/*", checkAuth);

app.route("/api/tasks", taskRoutes);
// app.route("/api/notes", noteRoutes);
// app.route("/api/users", userRoutes);
// app.route("/auth", authRoutes);

app.get("/", (c) => {
  return c.text("Lets Go");
});

export default app;
