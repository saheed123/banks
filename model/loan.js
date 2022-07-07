const mongoose = require('mongoose');
const {
  branchSchema
} = require("./branch");
const {userSchema } = require("./user");
const loanSchema = new mongoose.Schema({
  amount: {
    type: Number
  },
  interest: {
    type: Number,
    required: true
  },
  yearsToPay: {
    type: Number
  },
  monthlyPayment: {     
    type : Number
  },
  totalPayment: {
   type : Number
  },
  totalInterest: {
    type : Number
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  current_balance: {
    type: Number          
  },
  status: {
    type: String,
    enum : ["new", "rejected","approved"]
  },
  history: [{
    type : Object
  }]




});
const Loan = mongoose.model('loan', loanSchema);
module.exports = {
  Loan
}