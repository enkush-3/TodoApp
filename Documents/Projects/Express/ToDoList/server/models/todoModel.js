import mongoose from "mongoose";

const todoSchame = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Must provide user"],
    },
    title: {
        type: String,
        required: [true, "Must provide a title"],
    },
    description: {
        type: String || null,
    },
    isStatus: {
        type: String,
        enum: ["not_started", "processing", "done"],
        default: "not_started",
    },
    designUI: {
        type: String || null,
        default: "bg-gray-100 border-black-900 text-blue-600",
    },
});


const Todo = mongoose.model("Todo", todoSchame);

export default Todo;