import express from "express";
import {addTodo, deleteTodo, getAllTodo, getTodo, updateTodo} from "../controller/todo.js"
import {verifyToken} from "../utils/verify.js";

const router = express.Router();

router.get("/", verifyToken, getAllTodo);
router.post("/", verifyToken, addTodo);
router.put("/:id", verifyToken, updateTodo);
router.get("/:id", verifyToken, getTodo);
router.delete("/:id", verifyToken, deleteTodo);

export default router;
