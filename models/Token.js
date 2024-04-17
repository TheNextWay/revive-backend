const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  token: String,
  point: Number,
  name: String,
  claimed: Boolean
});

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
