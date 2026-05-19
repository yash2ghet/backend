import express from "express";
import middleware1 from "./middlewares/headers.middleware.ts"
import apiRouter from "./routes";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

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
    app.use("/api", apiRouter);

    app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
    });
}

await main();