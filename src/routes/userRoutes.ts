import { Hono } from "hono";
import {
  createUser,
  getUserByMail,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const userRoutes = new Hono();

userRoutes.post("/", createUser);
userRoutes.get("/:mail", getUserByMail);
userRoutes.put("/:mail", updateUser);
userRoutes.delete("/:mail", deleteUser);

export default userRoutes;
