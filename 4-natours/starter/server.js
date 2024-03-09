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
app.listen(port, () => console.log("Site is running on port"));
