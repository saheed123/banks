
const mongoose = require('mongoose');
require('dotenv').config();


const branchSchema = new mongoose.Schema({
  name: {
    type: String

  },
  house_no: {
    type: Number
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  branch_code: {
    type: Number
  },
  accountId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  }],
  Bank: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bank'
  },
  User: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]




});
const Branch = mongoose.model('Branch', branchSchema);
module.exports = {
  Branch,
  branchSchema
}