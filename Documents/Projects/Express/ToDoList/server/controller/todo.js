import {connectToBD} from "../utils/connect.js";
import Todo from "../models/todoModel.js"
import {createError} from "../utils/error.js";

export async function getAllTodo(req, res) {
    await connectToBD();
    const todos = await Todo.find({userID: req.user.id});
    res.status(200).json(todos);
}

export async function getTodo(req, res, next) {
    try {
        await connectToBD();
        const todo = await Todo.findById(req.params.id);
        if (!todo) return next(createError(404, "Todo not found"));
        if (todo.userID.toString() !== req.user.id) return next(createError(404, "You are not authorized"));
        res.status(200).json(todo);
    } catch (error) {
        next(createError(404, "Todo not found"));
    }
}


export async function updateTodo(req, res, next) {
    const id = req.params.id;
    if (!req.body)
        return next(createError(400, "Missing field"));
    try {
        await connectToBD();
        const todo = await Todo.findById(id);

        if (todo.userID.toString() !== req.user.id)
            return next(createError(404, "Not authorized"));

        todo.title = req.body.title || todo.title;
        todo.description = req.body.description || todo.description;
        todo.designUI = req.body.designUI || todo.designUI;

        if (req.body.isStatus !== undefined) {
            const allowedStatuses = ["not_started", "processing", "done"];
            if (!allowedStatuses.includes(req.body.isStatus)) {
                return next(createError(400, "Invalid status value"));
            }
            todo.isStatus = req.body.isStatus;
        }

        await todo.save();
        res.status(200).json({message: "Todo updated"});
    } catch (error) {
        return next(createError(400, "Todo not found"));
    }
}


export async function deleteTodo(req, res, next) {
    try {
        await connectToBD();
        const todo = await Todo.deleteOne({
            _id: req.params.id,
            userID: req.user.id,
        });
        if (!todo.deletedCount)
            return next(createError(404, "Todo not found"));
        res.status(200).json({message: "Todo deleted"});
    } catch (error) {
        return next(createError(400, "Todo not found"));
    }
}

export async function addTodo(req, res, next) {

    if (!req.body || !req.body.title) {
        return next(createError(400, "Most provide a title"));
    }
    await connectToBD();
    const newTodo = new Todo({title: req.body.title, description: req.body.description, designUI: req.body.designUI, userID: req.user.id});
    await newTodo.save();
    res.status(201).json(newTodo);

}