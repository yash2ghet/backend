import dotenv from "dotenv";
dotenv.config();

import express from "express";
import v1Routers from "./src/routes/v1";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  console.log("MongoDB connected successfully");
}

async function main() {
  await connectDB();

  app.use(cors({ origin: "*" }));
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/v1", v1Routers);

  app.listen(4000, () => {
    console.log("Server is running on http://localhost:4000");
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export default app;