import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "./app";

dotenv.config();

async function start() {
  await connectDB();
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

start();
