// libraries
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
// @ts-ignore
import { xss } from "express-xss-sanitizer";

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

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100,
});

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(limiter);
app.use(hpp());

// routes
app.use("/api/v1/auth", auth);
app.use("/api/v1/co-working-space", coWorkingSpace);
app.use("/api/v1/feedbacks", feedback);
app.use("/api/v1/reservations", reservation);

const PORT = process.env.PORT || 9000;
const server = app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${(err as Error).message}`);
  server.close(() => process.exit(1));
});
