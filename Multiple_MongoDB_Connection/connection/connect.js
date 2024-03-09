const mongoose = require("mongoose");

// Connection to the first database
const db1 = mongoose.createConnection("mongodb://localhost:27017/db1", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Connection to the second database
const db2 = mongoose.createConnection("mongodb://localhost:27017/db2", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

module.exports = { db1, db2 };
