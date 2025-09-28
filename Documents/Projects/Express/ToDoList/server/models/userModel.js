import mongoose from "mongoose";

const userSchame = new mongoose.Schema({
   email: {
       type: String,
       required: [true, "Most provide an email"],
       unique: true
   },
    password: {
        type: String,
        required: [true, "Most provide password"],
    }
});

const User = mongoose.model("User", userSchame);

export default User;