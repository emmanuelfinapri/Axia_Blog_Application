// index.js
const express = require("express");
const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();
const app = express();

mongoose
  .connect(process.env.JWT_SECRETE)
  .then(() => console.log("Connected"))
  .catch(() => console.log("There's an error"));

const PORT = process.env.PORT;
console.log(PORT);

app.listen(PORT, () => {
  console.log(`Connected on port ${PORT}`);
});
