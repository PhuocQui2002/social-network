import mongoose from "mongoose";
import {  login,  register } from "../controllers/userController.js";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log('mongodb connected successfully.');
        
    } catch (error) {
        console.log(error);
    }
}
export default connectDB;