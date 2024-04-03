const express = require("express");
const cookieParser = require("cookie-parser");
const User = require("./Controllers/userController");
const Task = require("./Controllers/TaskController");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1", User);
app.use("/api/v1", Task);

module.exports = app;
