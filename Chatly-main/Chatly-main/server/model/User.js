import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        profileImage: {
            type: String,
            required: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        friends: {
            type: Array,
            default: [],
        }
    },
);

const User = mongoose.model("User", userSchema);
export default User;