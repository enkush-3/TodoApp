import {createError} from "../utils/error.js";
import {connectToBD} from "../utils/connect.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export async function register(req, res, next) {
    const data = req.body;

    if (!data?.email || !data?.password) {
        return next(createError(400, "Most provide email and password"));
    }
    await connectToBD();
    const alreadyRegistered = await User.exists({email: data.email});
    if (alreadyRegistered) return next(createError(400, "User already registered"));
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({...req.body, password: hash})

    await newUser.save();
    res.status(201).json("User created successfully");

}

export async function login(req, res, next) {
    const data = req.body;

    if (!data?.email || !data?.password) {
        return next(createError(400, "Most provide email and password"));
    }
    await connectToBD();

    const user = await User.findOne({email: data.email});
    if (!user)
        return next(createError(400, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(data.password, user.password);
    if (!isPasswordCorrect)
        return next(createError(400, "Wrong password"));

    const token = jwt.sign({id: user._id}, process.env.JWT);
    res.cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }).status(200).json("User logged in");

}

export async function logout(req, res) {

    res.clearCookie("access_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }).status(200).json({message: "Log out successfully"});

}