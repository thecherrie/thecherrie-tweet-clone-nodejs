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
app.use(session({secret:"secret-key-goes-here",
  resave: false,
  saveUninitialized: true}));

app.set('view engine', 'ejs');

mongoose.connect("mongodb://localhost:27017/tweetDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.listen(3000, function() {
  console.log("Started on port 3000.");
});

app.get("/", function(req, res) {

  Tweet.find({}, function(err, foundTweet) {
    console.log(foundTweet);

    res.render('index.ejs', {
      tweets: foundTweet,
    });
  });
});

app.get("/login", function(req, res) {

  Tweet.find({}, function(err, foundTweet) {
    console.log(foundTweet);

    res.render('login.ejs', {
    });
  });
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/compose", function(req, res) {
  Tweet.find({}, function(err, foundTweet) {
    console.log(foundTweet);

    res.render('compose.ejs', {
      tweets: foundTweet,
      username: req.session.username
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
      //USER LOGS IN!
      console.log("Log in is good.");
      req.session.username = username;
      req.session.user = foundUser;
      res.redirect("/dashboard");
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
  const username = req.body.usernameField;
  const password = req.body.passwordField;

  newUser = new User({
    username: username,
    password: password
  });

  newUser.save(function(err, user){
    if (err) throw err;
  });

});
