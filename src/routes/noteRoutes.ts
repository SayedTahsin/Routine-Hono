import { Hono } from "hono";
import {
  createNote,
  getNotesByMail,
  updateNote,
  deleteNote,
} from "../controllers/noteController";

const noteRoutes = new Hono();

noteRoutes.post("/", createNote);
noteRoutes.get("/", getNotesByMail);
noteRoutes.put("/:id", updateNote);
noteRoutes.delete("/:id", deleteNote);

export default noteRoutes;
