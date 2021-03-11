//!/ ............................... comment .............................. */
//! ............................... comment .............................. */
//todo ............................... comment .............................. */
//* ............................... comment .............................. */
//? ............................... comment .............................. */
//> ............................... comment .............................. */
//- ............................... comment .............................. */
//o ............................... comment .............................. */
//// ............................... comment .............................. */
///! ............................... comment .............................. */

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const connectFlash = require("connect-flash");

require("./DB/mongoConnection");
require("./passport/local-auth");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const allRouter = require("./routes/all");
const newRouter = require("./routes/new");
const signUpRouter = require("./routes/sign-up");
const signInRouter = require("./routes/sign-in");
const logOutRouter = require("./routes/log-out");

let app = express();

//- view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//> ............................... middelwares .............................. */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

/////////////////////////////////////////////
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(connectFlash()); //> must be here
app.use(passport.session());

app.use((req, res, next) => {
  app.locals.signUpMessage = req.flash("signUpMessage"); //> variable accessible throughout the application
  app.locals.signInMessage = req.flash("signInMessage"); //> variable accessible throughout the application
  next();
});

//o ................................. routers ................................ */
app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/all", allRouter);
app.use(
  "/new",
  (req, res, next) => {
    if (req.isAuthenticated()) return next();

    res.redirect("/");
  },
  newRouter
);

app.use("/signUp", signUpRouter);
app.use("/signIn", signInRouter);

app.use("/logout", logOutRouter);

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
