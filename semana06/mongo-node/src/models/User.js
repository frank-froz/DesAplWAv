import { create } from "domain";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    lastName: String,
    email: { type: String, unique: true },
    age: { type: Number, min: 18, required: true },
    phoneNumber: String,
    password: { minlength: 8, type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);