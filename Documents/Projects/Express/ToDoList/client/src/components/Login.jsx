import React, {useActionState, useEffect, useState} from "react";
import {Label} from "@/components/ui/label.jsx";
import {Input} from "@/components/ui/input.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Link, useNavigate} from "react-router-dom";
import {login} from "@/actions/userActions.jsx";

const Login = () => {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({email: "", password: ""});
    const [state, formAction, isPending] = useActionState(login, {
        success: null,
        error: null
    });

    useEffect(() => {
        if (state.success) {
            setTimeout(() => {
                navigate("/");
            }, 2000);
        }
    }, [state.success]);

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    };
    return (
        <div
            className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
            <form action={formAction}
                  className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md flex flex-col gap-6">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

                <div className="flex flex-col gap-2">
                    <Label className="text-gray-600 font-medium">Email</Label>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        // onChange={(e) => setFormData({...formData, email: e.target.value})}
                        onChange={handleChange}
                        className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label className="text-gray-600 font-medium">Password</Label>
                    <Input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
                    />
                </div>
                <Button
                    disabled={isPending}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg shadow-md transition">
                    {isPending ? "Loging in" : "Login"}
                </Button>
                {
                    state.error && (
                        <span className=" text-center text-red-600 font-medium ">{state.error}</span>
                    )
                }

                <span className="text-gray-600 text-center text-sm">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-indigo-600 font-medium hover:underline hover:text-indigo-800 transition"
                    >
                    Login
                  </Link>
                </span>
            </form>
        </div>

    );
}
export default Login;