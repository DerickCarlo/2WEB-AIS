if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//dependencies
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const express = require("express");
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
const { off } = require("process");
const mysql2 = require("mysql2");
const { brotliDecompress } = require("zlib");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const jwt  = require('jsonwebtoken');
const {
  isAuth,
  requireRole,
  notAuth,
  theseRoles,
} = require("./js/middlewares");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user: process.env.userEmailRecovery,
      pass: process.env.passEmailRecovery
    }
});
//express app
const app = express();

//register view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views/"));

//static folder || loads all assets from public folder
app.use(express.static(__dirname + "/public"));

var options = {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
  timezone: "+00:00",
};
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    key: "session_cookie_name",
    secret: "SECRET",
    store: sessionStore,
    cookie: { maxAge: 3000000 }, //in milliseconds. 30 minutes
    resave: false,
    saveUninitialized: false,
  })
);

var sessionStore = new MySQLStore(options);

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
  "INSERT INTO coa (classification, accountName, code, mapping, description, normalBalance, action) VALUES (?,?,?,?,?,?,?);",
  [1, 2, 3, 4, 5, 6, 7],
  (err, result) => {
    if (err) throw err;
    console.log("inserted");
  }
);

//webpage routes

app.get("/logout", function (req, res) {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/", notAuth, function (req, res) {
  res.render("land");
});

app.post("/", notAuth, function (req, res) {
  var { email, password } = req.body;
  con.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) throw err;
      if (result.length == 0) {
        console.log("email does not exist");
        res.redirect("/");
      }
      userPassword = result[0].password;
      var isMatch = await bcrypt.compare(password, userPassword);
      if (!isMatch) {
        console.log("password is wrong");
        res.redirect("/");
      } else {
        req.session.isAuth = true;

        if (result[0].role == "pao") {
          req.session.user = "pao";
        }
        if (result[0].role == "admin") {
          req.session.user = "admin";
        }
        res.redirect("/home");
      }
    }
  );
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  var { email, password, name, role } = req.body;
  con.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) throw err;
      if (result.length !== 0) {
        res.redirect("/register");
      } else {
        try {
          var hashedPassword = await bcrypt.hash(password, 10);
          let user_Password = hashedPassword;
          con.query(
            "INSERT INTO users (password, email, name, role) VALUES (?,?,?,?)",
            [user_Password, email, name, role],
            (err, result) => {
              if (err) throw err;
            }
          );
          res.redirect("/");
        } catch (e) {
          console.log(e);
          res.redirect("/register");
        }
      }
    }
  );
});

app.get("/home", isAuth, requireRole("admin"), function (req, res) {
  res.render("home");
});

app.get("/journal", function (req, res) {
  res.render("journal-entry");
});

app.get("/trial-balance", function (req, res) {
  res.render("trial-balance");
});

app.get("/system-user", function (req, res) {
  con.query("SELECT * FROM users", (err, result) => {
    if (err) throw err;
    console.log("query successful");
    console.log(result.length);
    res.render("sys-users", { data: result });
  });
});

app.get("/coa", function (req, res) {
  con.query("SELECT * FROM  coa", (err, result) => {
    if (err) throw err;
    console.log("query successful");
    console.log(result.length);
    res.render("chart-of-accounts", { data: result });
  });
});

app.get("/tax-report", function (req, res) {
  res.render("tax-rep");
});

const JWT_SECRET = 'some super secret...';

app.get('/', (req, res) => {
    res.send('Hello world');
});

app.get('/forgot-password', (req, res, next) =>{
    res.render('forgot-password');
});

app.post('/forgot-password', (req, res, next) =>{
    const { email } = req.body;
   



if(email !== user.email){
    res.send("user not registered");
    return;
};

const secret = JWT_SECRET + user.password;
const payload = {
    email: user.email,
    id: user.id
};
const token = jwt.sign(payload, secret, {expiresIn: '15mins'});
const link = `http://localhost:5000/reset-password/${user.id}/${token}`;
//console.log(link);

const options = {
    from: process.env.userEmailRecovery,
    to: user.email,
    subject: "password recovery link",
    text: "requested password link: " + link
}

transporter.sendMail(options, function(err, info) {
    if(err){
        console.log(err);
        return;
    }else{
        console.log("sent: " + info.response);
    }
});
    
res.render('reset-confirmation');
});

app.get('/reset-password/:id/:token', (req, res, next) =>{
    const { id, token } = req.params;
    
 
    if(id !== user.id){
        res.send('invalid id');
        return;
    }
 
    const secret = JWT_SECRET + user.password;
    try{
        const payload = jwt.verify(token, secret);
        res.render('reset-password', {email: user.email});   
    }catch(error){
        console.log(error.message);
        res.send('session expired');
    }

});
app.post('/reset-password/:id/:token', (req, res, next) =>{
    const { id, token } = req.params;
    const {password, password2} = req.body;
   
    if(id !== user.id){
        res.send('invalid id');
        return;
    }
    
    const secret = JWT_SECRET + user.password;
    try{
        const payload = jwt.verify(token, secret);
        

        user.password = password;
        res.send(user);
    }catch(error){
        console.log(error.message);
        res.send(error.message);
    }
});
//initializing ports
const PORT = process.env.PORT || 5000;
app.listen(PORT);
