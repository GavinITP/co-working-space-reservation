const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/connectDB");
const auth = require("./routes/auth");

dotenv.config({ path: "./config/.env" });
connectDB();

const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// routes
app.use("/api/v1/auth", auth);

const port = process.env.PORT;
app.listen(port, console.log("Server is running on port:", port));
