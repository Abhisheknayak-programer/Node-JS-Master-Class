const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes"); //importing all the routes
const userRouter = require("./routes/userRoutes"); //importing all the routes

const app = express();

////////////////////////////////////////// MIDDLEWARES /////////////////////////////
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(express.json()); // Middleware for post method (used to parse the data from the body)

app.use(express.static(`${__dirname}/public/`)); // Used for serving the static files

// // The below middleware is called as the global middleware which is called whenever any request is done
// app.use((req, res, next) => {
//   console.log("Hello from the middleware");
//   next();
// });

// // The below Middleware add the requested Time to request Object so that can be accessed whenever needed
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   next();
// });

// const getInitialPage = (req, res) => {
//   res.status(200).send("Abhishek Nayak");
// };

////////////////////////////////////////// ROUTES ////////////////////////////////
// app.get("/", getInitialPage);
app.use("/api/v1/tours", tourRouter); // Mouting the routes
app.use("/api/v1/users", userRouter); // Mouting the routes

//Handling for Error Route after all the routes [Always add in bottom]
app.all("*", (req, res, next) => {
  next(new AppError(`Can't Find ${req.originalUrl}`, 404));
});

// Implementing a Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
