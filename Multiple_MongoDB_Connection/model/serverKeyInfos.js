const mongoose = require("mongoose");
const { db1 } = require("../connection/connect");

// Schema for the first database
const schema1 = new mongoose.Schema({
  pub_key: {
    type: String,
  },
  pvt_key: {
    type: String,
  },
});

// Model for the first database
const Model1 = db1.model("Model1", schema1);
module.exports = Model1;
