import { Hono } from "hono";
import {
  createTask,
  deleteTask,
  getTasksByMail,
  updateTask,
} from "../controllers/taskController";

const taskRoutes = new Hono();

taskRoutes.post("/", createTask);
taskRoutes.get("/", getTasksByMail);
taskRoutes.put("/:id", updateTask);
taskRoutes.delete("/:id", deleteTask);

export default taskRoutes;
