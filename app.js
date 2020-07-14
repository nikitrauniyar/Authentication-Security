//jshint esversion:6
require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds= 10;

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, function(err) {
  if (!err) {
    console.log("Server is connected to 'userDB' Database on port 27017");
  } else {
    console.log(err);
  }
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.route("/register")

.get(function(req, res) {
  res.render("register");
})

.post(function(req, res) {

  bcrypt.hash(req.body.password, saltRounds , function(err, hash){
    const newUser = new User({
      email: req.body.username,
      password: hash
    });

    newUser.save(function(err) {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });

});

app.route("/login")

.get(function(req, res) {
  res.render("login");
})

.post(function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password, foundUser.password, function(err, result){
          if(result===true){
            res.render("secrets");
          }
        });
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server is up and running on port 3000.")
});
