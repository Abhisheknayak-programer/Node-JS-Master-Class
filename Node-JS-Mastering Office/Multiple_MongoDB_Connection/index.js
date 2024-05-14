const express = require("express");
require("./connection/connect");
const Model1 = require("./model/serverKeyInfos");
const Model2 = require("./model/controllerKeyInfo");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const data1 = Model1.create({ pub_key: "Abhishek", pvt_key: "Nayak" });

// Creating data for the second database
const data2 = Model2.create({ pub_key: "ABC", pvt_key: "DEF" });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
