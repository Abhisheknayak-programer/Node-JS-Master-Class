const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require("./../../model/tourModel");
const Reviews = require("./../../model/reviewModel");
const Users = require("./../../model/userModel");

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

// Read JSON File
const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, "utf-8")
);

const usersData = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, "utf-8")
);

const reviewsData = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

// Import data Into DB
const importData = async () => {
  try {
    await Tour.create(toursData);
    await Users.create(usersData, { validateBeforeSave: false });
    await Reviews.create(reviewsData);
    console.log("Imported All Data");
    process.exit(); // Exit the terminal or abort the terminal
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany({}); //Delete all the tours available in tours collections
    await Users.deleteMany({});
    await Reviews.deleteMany({});

    console.log("Deleted All Data");
    process.exit(); // Exit the terminal or abort the terminal
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
