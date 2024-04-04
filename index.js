// libraries
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// config
const connectDB = require("./config/connectDB");

// routes
const auth = require("./routes/auth");
const coWorkingSpace = require("./routes/coWorkingSpace");
const feedBack = require("./routes/feedback");
const reservation = require("./routes/reservation");

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
app.use("/api/v1/feedbacks", feedBack);
app.use("/api/v1/reservation", reservation);

const port = process.env.PORT;
app.listen(port, console.log("Server is running on port:", port));
