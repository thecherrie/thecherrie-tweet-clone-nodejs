const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  author: {
    type: String,
  },
  text: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

const Tweet = mongoose.model('tweet', tweetSchema);
module.exports = Tweet;
