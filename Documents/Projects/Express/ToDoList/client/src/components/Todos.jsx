import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { CircleUserRound, DeleteIcon, Plus } from "lucide-react";
import useSWR from "swr";
import { Input } from "@/components/ui/input.jsx";
import EditTodo from "@/components/ui/EditTodo.jsx";
import { designUIMap } from "@/utils/designUiMap";

const fetcher = (url, options = {}) =>
    fetch(url, {
        method: options.method || "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: options.body ? JSON.stringify(options.body) : undefined,
    }).then((res) => res.json());

const Todos = () => {
    const { data, error, mutate, isLoading } = useSWR(
        "http://localhost:3000/api/todos",
        fetcher
    );

    const [todoList, setTodoList] = useState([]);
    const [openId, setOpenId] = useState(null); // Dropdown-н нээлттэй todo
    const wrapperRefs = useRef({}); // Todo бүрд ref хадгалах

    useEffect(() => {
        if (data) setTodoList(data); // SWR-аас өгөгдөл оруулж өгнө
    }, [data]);

    // Гадна дарахад dropdown хаах
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!Object.values(wrapperRefs.current).some(ref => ref?.contains(event.target))) {
                setOpenId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (error) return <h1 className="text-2xl py-2 text-center">Something went wrong</h1>;
    if (isLoading) return <h1 className="text-2xl py-2 text-center">Loading...</h1>;

    function handleError(error) {
        toast.error(error);
        throw new Error(error);
    }

    // ➕ Add todo
    async function handleAddTodo(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const title = formData.get("title");

        if (!title.trim()) {
            toast.error("Todo can't be empty");
            return;
        }

        const newTodo = {
            title: `${title} adding...`,
            _id: Date.now().toString(),
            isStatus: "not_started",
            designUI: "default",
        };

        async function addTodo() {
            const response = await fetcher("http://localhost:3000/api/todos", {
                method: "POST",
                body: { title },
            });
            if (response.error) handleError(response.error);
            return [...data, response];
        }

        await mutate(addTodo(), {
            optimisticData: [...data, newTodo],
            revalidate: true,
            rollbackOnError: true,
        });

        e.target.reset();
    }

    // 🗑 Delete todo
    async function deleteTodo(id) {
        toast.success("Todo deleted");
        await mutate(
            async () => {
                const response = await fetcher(`http://localhost:3000/api/todos/${id}`, { method: "DELETE" });
                if (response.error) handleError(response.error);
                return data.filter((todo) => todo._id !== id);
            },
            { optimisticData: data.filter((todo) => todo._id !== id), rollbackOnError: true, revalidate: true }
        );
    }

    // ✏ Update todo
    async function handleUpdate(formData) {
        const { id, title } = formData;
        await mutate(
            async () => {
                const response = await fetcher(`http://localhost:3000/api/todos/${id}`, {
                    method: "PUT",
                    body: { title },
                });
                if (response.error) handleError(response.error);
                return data.map(todo => (todo._id === id ? { ...todo, title } : todo));
            },
            { optimisticData: data.map(todo => (todo._id === id ? { ...todo, title } : todo)), rollbackOnError: true, revalidate: false }
        );
    }

    // ✅ Update status
    async function updateStatus(id, status) {
        await mutate(
            async () => {
                const response = await fetcher(`http://localhost:3000/api/todos/${id}`, {
                    method: "PUT",
                    body: { isStatus: status },
                });
                if (response.error) handleError(response.error);
                return todoList.map(todo => (todo._id === id ? { ...todo, isStatus: status } : todo));
            },
            {
                optimisticData: todoList.map(todo => (todo._id === id ? { ...todo, isStatus: status } : todo)),
                rollbackOnError: true,
                revalidate: false,
            }
        );
        setOpenId(null);
    }

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
            <div className="flex flex-col items-center mb-8">
                <CircleUserRound className="w-16 h-16 text-blue-500 mb-3 drop-shadow-md" />
                <h1 className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 font-extrabold text-5xl text-center text-transparent bg-clip-text drop-shadow-lg">
                    Todo App
                </h1>
            </div>

            {/* Add form */}
            <form onSubmit={handleAddTodo} className="flex gap-3 items-center bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-200">
                <Input type="text" placeholder="Enter Todo" name="title" id="title" required
                       className="shadow-sm rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                <button className="h-10 rounded-lg border border-blue-500 bg-blue-500 px-5 text-white font-medium shadow-md flex items-center gap-2 hover:bg-blue-600 transition-all duration-200">
                    <Plus size="20" />
                    Add
                </button>
            </form>

            {/* Todos List */}
            <div className="space-y-4 w-full max-w-2xl mt-8">
                {todoList && todoList.map((todo) => (
                    <div key={todo._id} className={`rounded-xl shadow-md p-5 border transition-all duration-200 hover:shadow-lg ${designUIMap[todo.designUI] || designUIMap.default}`}>
                        {/* Title & Actions */}
                        <div className="flex justify-between items-center mb-2">
                            <h2 className={`text-xl font-semibold ${todo.isStatus === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>
                                {todo.title}
                            </h2>
                            <div className="flex gap-2 items-center">
                                <EditTodo title={todo.title} id={todo._id} handleUpdate={handleUpdate} />
                                <DeleteIcon
                                    className="w-5 h-5 cursor-pointer hover:text-red-500"
                                    onClick={() => deleteTodo(todo._id)}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        {todo.description && <p className="text-gray-600 mb-2 text-sm">{todo.description}</p>}

                        {/* Status Dropdown */}
                        <div ref={el => (wrapperRefs.current[todo._id] = el)} className="relative w-44">
                            <button
                                className="w-full px-4 py-2 rounded-full border shadow-sm text-left bg-white flex justify-between items-center"
                                onClick={() => setOpenId(openId === todo._id ? null : todo._id)}
                            >
                                {todo.isStatus.replace("_", " ")}
                                <span>▼</span>
                            </button>

                            {openId === todo._id && (
                                <div className="absolute w-full bg-white border shadow-md mt-1 rounded-lg z-10">
                                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => updateStatus(todo._id, "not_started")}>
                                        Not Started
                                    </div>
                                    <div className="px-4 py-2 hover:bg-yellow-100 cursor-pointer" onClick={() => updateStatus(todo._id, "processing")}>
                                        Processing
                                    </div>
                                    <div className="px-4 py-2 hover:bg-green-100 cursor-pointer" onClick={() => updateStatus(todo._id, "done")}>
                                        Done
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Todos;
