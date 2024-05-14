class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "failed" : "error";

    this.isOperational = true; //To check that this error is coming from our declration or from other parts of the code

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
