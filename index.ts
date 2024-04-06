// libraries
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

// config
import connectDB from "./config/connectDB";

// routes
import auth from "./routes/auth";
import coWorkingSpace from "./routes/coWorkingSpace";
import feedback from "./routes/feedback";
import reservation from "./routes/reservation";

// set up
dotenv.config({ path: "./config/.env" });
connectDB();

const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/co-working-space", coWorkingSpace);
app.use("/api/v1/feedbacks", feedback);
app.use("/api/v1/reservations", reservation);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log("Server is running on port:", port);
});
