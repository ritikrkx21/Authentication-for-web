//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

//requiring mongoose-encryption package//
var encrypt = require('mongoose-encryption');



mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

//mongoose schema class//
const userSchema = new mongoose.Schema({
  email:String,
  password:String
});


//secret should be a long string//


//now using secret to encrypt our database//
//adding plugin to our mongoose schema//
//adding encrypt package as a plugin//
userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);






const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));






app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function(req,res){


  const newUser = new User({
    email:req.body.username,
    password:req.body.password

  });

  newUser.save(function(err){
    if(!err)
    res.render("secrets");
    else
    console.log(err);
  });


});






app.post("/login",function(req,res){
  const username =  req.body.username;
  const password =  req.body.password;

  User.findOne({email:username},function(err,foundUser){
    if(err)
    console.log(err);
    else
    if(foundUser){
      if(foundUser.password === password){
        res.render("secrets");
      }
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
