var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require("dotenv").config();
const mongoose = require("mongoose");
const mongoDB =
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@express-inventory-app.zgh9lsl.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, { useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const gameConsoleRouter = require("./routes/gameConsoleRoutes");
const gameRouter = require("./routes/gameRoutes");
const accessoryRouter = require("./routes/accessoryRoutes");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/gameConsoles", gameConsoleRouter);
app.use("/games", gameRouter);
app.use("/accessories", accessoryRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
