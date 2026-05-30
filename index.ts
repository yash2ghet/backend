import dotenv from "dotenv";
dotenv.config();

import express from "express";
import v1Routers from "./src/routes/v1";
import cors from "cors";
import mongoose from 'mongoose';

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
console.log(process.env.JWT_SECRET);
console.log(process.env.MONGODB_URI);

const app = express();

async function connectDB(): Promise<void> {

    await mongoose.connect(process.env.MONGODB_URI as string);

    console.log("MongoDB connected successfully");

    mongoose.connection.on("error", (err: Error) => {
        console.error(`MongoDB connection error: ${err.message}`);
    })
}

async function main() {
    await connectDB();

    app.use(cors({ origin: "*" }));
    app.use(express.json({ limit: "10kb"}));
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/v1", v1Routers);

    app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
    });
}

await main();