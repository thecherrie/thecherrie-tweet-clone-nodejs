require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();

//models
const Tweet = require('./models/Tweet');
const User = require('./models/User');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(session({secret: process.env.DB_SECRET,
  resave: false,
  saveUninitialized: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/tweetDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Server started on port ${process.env.PORT}`);
});

app.get("/", function(req, res) {

  Tweet.find({}, function(err, foundTweet) {
    console.log(foundTweet);

    res.render('index.ejs', {
      tweets: foundTweet,
      session: req.session
    });
  });
});

app.get("/login", function(req, res) {

  Tweet.find({}, function(err, foundTweet) {
    console.log(foundTweet);

    res.render('login.ejs', {
      isError: false,
      session: req.session
    });
  });
});

app.get("/logout", function(req, res) {
  req.session.destroy();
  res.redirect("/")
});

app.get("/signup", function(req, res) {
  res.render("signup", {
    session: req.session
  });
});

app.get("/compose", function(req, res) {
  if(!req.session.user){
    res.redirect("/login");
  }
  Tweet.find({}, function(err, foundTweet) {
    console.log(foundTweet);

    res.render('compose.ejs', {
      tweets: foundTweet,
      username: req.session.username,
      session: req.session
    });
  });
})

//posts
app.post("/tweet", function(req, res) {
  const tweetText = req.body.tweetText;

  const newTweet = new Tweet({
    author: req.session.username,
    text: tweetText,
    date: new Date().toLocaleString()
  })

  newTweet.save(function(err, tweet) {
    if(err) throw err;
  });

  res.redirect("/")

});

app.post("/login", function(req, res) {
  const username = req.body.usernameField;
  const password = req.body.passwordField;

  User.findOne({username: username, password: password}, function(err, foundUser){
    if(err){
      console.log(err);
    }else{
      if(!foundUser){
        res.render("login", {
          isError: true,
          session: req.session
        })
      }else{
        //USER LOGS IN!
        console.log("Log in is good.");
        req.session.username = username;
        req.session.user = foundUser;
        res.redirect("/dashboard");
      }
    }
  });

});

app.get("/dashboard", function(req, res) {
  if(!req.session.user){
    //user is not signed in.
    return res.redirect("/login");
    //res.redirect("/login");
  }
  //user is signed in
  return res.redirect("/compose");
});

app.post("/signup", function(req, res) {
  console.log(`session = ${req.session}`);

  const username = req.body.usernameField;
  const password = req.body.passwordField;

  newUser = new User({
    username: username,
    password: password
  });

    req.session.user = newUser;
    req.session.username = newUser.username;
  //
  //   Tweet.find({}, function(err, foundTweet) {
  //
  //     res.render('compose.ejs', {
  //       tweets: foundTweet,
  //       username: req.session.username,
  //       session: req.session
  //     });
  //   });
  // }

  newUser.save(function(err, user){
    if (err){
      console.log(err);
    }else{
      res.redirect("/compose");
    }
  });
});
