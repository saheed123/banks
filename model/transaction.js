const mongoose = require("mongoose");


require("dotenv").config;
const transactionSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'

  },
  accountNumber: {
   type: Number
  },
  from: {
    type: Number
  },
  to: {
    type: Number
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  dateOfTransaction: {
    type: Date,
    default: Date.now
  },

  amount: {
    type: Number,
    default : 0
  },
  action: {
   type: String
  },
  accountName: {
    type: String
  },
  staffCode: {
    type : Number
  }


});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = {
  Transaction,transactionSchema
}