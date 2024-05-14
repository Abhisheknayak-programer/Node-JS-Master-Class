const AppError = require("./../utils/appError");

// Handle Cast Error is handled for the situation where the Object Id is not present inside the collection and user is requesting for any random object ID
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

// Handling Duplicate Database Field Names
const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate Field Value : ${err.keyValue.name} , Please use any other value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data : ${errors.join(". ")}.`;
  return new AppError(message, 404);
};

const handleJWTError = () => {
  return new AppError("Invalid Token! Please login again", 401);
};

const handleJWTTokenExpError = () => {
  return new AppError("Your Token have expired! Please login again", 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational Errors, Trusted Errors : Send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming Errors or other unknown error : Don't Leak error details
    // 1. Log the error
    console.error("Error : ", err);

    // 2. Send a generic message as a response to UI
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError" || error.__proto__.name === "CastError")
      error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);

    //JWT Errors Handling
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTTokenExpError();

    sendErrorProd(error, res);
  }
};
