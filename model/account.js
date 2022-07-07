const mongoose = require('mongoose');
require('dotenv').config;
const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId

  },
  date: {
    type: Date,
    default: Date.now
  },
  accountNumber: {
    type: Number,
    unique :  true

  },
  current_balance: {
    type: Number,
    default : 0
  },
  Type: {
    type: String,
    enum: ['savings', 'current', 'fixed-deposit'],
    lowercase : true
  },
  accountName: {
    type: String
  }
});
const Account = mongoose.model('Account', accountSchema);
module.exports = {
  Account, accountSchema
}