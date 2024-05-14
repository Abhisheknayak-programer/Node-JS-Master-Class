const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection to DB Successful");
  })
  .catch(() => {
    console.log("Error in Connecting DB");
  });

const app = require("./app");

// console.log(process.env);
// console.log(app.get("env"));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log("Site is running on port"));

// The below code helps to not crash the application even if any unhandled rejections of promise happens also called as safety net
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection");
  // Server shutdown implemented before process.exit because to process the ongoing requests and after that close exit the application
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
