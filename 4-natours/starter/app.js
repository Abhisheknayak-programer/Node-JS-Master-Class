const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSantize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const tourRouter = require("./routes/tourRoutes"); //importing all the routes
const userRouter = require("./routes/userRoutes"); //importing all the routes

const app = express();

////////////////////////////////////////// GLOBAL MIDDLEWARES /////////////////////////////
// Set Security HTTP Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// RATE LIMITING FOR A UNIQUE IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again after an hour!",
});
app.use("/api", limiter); // It means it will be only applied to all routes starting with /api as endpoint

app.use(express.json({ limit: "10kb" })); // Middleware for post method (used to parse the data from the body)

// Data Santization against NOSQL Query Injection
app.use(mongoSantize());

// Data Santization against XSS or Cross Site Scripting Attacks
app.use(xss());

// Prevents Paramter Pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

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
