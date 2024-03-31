const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/connectDB");

dotenv.config({ path: "./config/.env" });
connectDB();

const app = express();

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors());

// routes
app.get("/", (_req, res) => {
  res.json({ message: "It's working" });
});

const port = process.env.PORT;
app.listen(port, console.log("Server is running on port:", port));
