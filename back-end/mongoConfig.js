
require("dotenv").config();
const mongoose = require("mongoose");

const mongoDb = process.env.MONGODB_URL;

mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));