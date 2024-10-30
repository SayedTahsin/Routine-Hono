import { Hono } from "hono";
import {
  createUser,
  getUserByMail,
  updateUser,
  deleteUser,
} from "../controllers/userController";
import { checkAuth } from "../middlewares/checkAuth";

const userRoutes = new Hono();

userRoutes.post("/", createUser);
userRoutes.get("/:mail", checkAuth, getUserByMail);
userRoutes.put("/:mail", checkAuth, updateUser);
userRoutes.delete("/:mail", checkAuth, deleteUser);

export default userRoutes;
