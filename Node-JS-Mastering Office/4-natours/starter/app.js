const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes"); //importing all the routes
const userRouter = require("./routes/userRoutes"); //importing all the routes
const reviewRouter = require("./routes/reviewRoutes"); //importing all the routes
// const viewRouter = require("./routes/viewRoutes"); //importing all the routes

const app = express();
app.use(cors());

// app.set("view engine", "pug"); //Setting the template engine
// app.set("views", path.join(__dirname, "views")); //Setting the path for views folder
// app.use(express.static(path.join(__dirname, "public"))); // Used for serving the static files

// app.set("view engine", "pug");
// app.set("views", path.join(__dirname, "views"));

// 1) GLOBAL MIDDLEWARES
// Serving static files
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

////////////////////////////////////////// MIDDLEWARES /////////////////////////////
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json()); // Middleware for post method (used to parse the data from the body)

// // The below middleware is called as the global middleware which is called whenever any request is done
// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

// // The below Middleware add the requested Time to request Object so that can be accessed whenever needed
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

// const getInitialPage = (req, res) => {
//   res.status(200).send("Abhishek Nayak");
// };

////////////////////////////////////////// ROUTES ////////////////////////////////
// app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter); // Mouting the routes
app.use("/api/v1/users", userRouter); // Mouting the routes
app.use("/api/v1/reviews", reviewRouter); // Mouting the routes

//Handling for Error Route after all the routes [Always add in bottom]
app.all("*", (req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl}`, 404));
});

// Implementing a Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
