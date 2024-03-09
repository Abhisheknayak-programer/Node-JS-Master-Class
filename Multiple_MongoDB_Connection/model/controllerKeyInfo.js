const mongoose = require("mongoose");
const { db2 } = require("../connection/connect");

// Schema for the second database
const schema2 = new mongoose.Schema({
  pub_key: {
    type: String,
  },
  pvt_key: {
    type: String,
  },
});

// Model for the second database
const Model2 = db2.model("Model2", schema2);
module.exports = Model2;
