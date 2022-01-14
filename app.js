if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//dependencies
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const express = require("express");
const { off } = require("process");
const mysql2 = require("mysql2");

//express app
const app = express();

//register view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views/"));

//static folder || loads all assets from public folder
app.use(express.static(__dirname + "/public"));

//fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));

//database
const con = mysql2.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  multipleStatements: true,
  timezone: "+00:00",
});

con.connect((err) => {
  if (!err) {
    console.log(`connected to MySQL server at port ${process.env.PORTDB}...`);
  } else {
    console.log(err);
  }
});

con.query(
  "INSERT INTO users (classification, accountName, code, mapping, description, normalBalance, action) VALUES (?,?,?,?,?,?,?);",
  [1, 2, 3, 4, 5, 6, 7],
  (err, result) => {
    if (err) throw err;
    console.log("inserted");
  }
);

//webpage routes
app.get("/", function (req, res) {
  res.render("land");
});
app.get("/home", function (req, res) {
  res.render("home");
});
app.get("/journal", function (req, res) {
  res.render("journal-entry");
});
app.get("/trial-balance", function (req, res) {
  res.render("trial-balance");
});
app.get("/system-user", function (req, res) {
  res.render("sys-users");
});
app.get("/coa", function (req, res) {
  con.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    result = result[0];
    console.log("query successful");
    console.log(result.length);
    res.render("chart-of-accounts", { data: result });
  });
});
app.get("/tax-report", function (req, res) {
  res.render("tax-rep");
});

//initializing ports
const PORT = process.env.PORT || 5000;
app.listen(PORT);
