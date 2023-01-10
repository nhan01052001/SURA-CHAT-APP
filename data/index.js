const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
require("dotenv/config");

app.use(express.json());

// import routes
const postRoute = require("./routes/posts");

app.use(bodyParser.json());

app.use("/posts", postRoute);

// ROUTES
app.get("/", (req, res) => {
  res.send("Home");
});

// connect to DB
mongoose.connect(process.env.DB_CONNECTION, () => console.log("connect to DB"));

app.listen(3000, () => {
  console.log(`Server Started at ${3000}`);
});
