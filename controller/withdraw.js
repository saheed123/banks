const { Branch } = require('../model/branch');
const {Account} = require('../model/account');
const { Transaction } = require('../model/transaction');

const mongoose = require('mongoose');
const {
  validationResult
} = require('express-validator');
exports.withdraw = async (req,res, next)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
   
  
  const withdraw = new Transaction({
    ...req.body
    
  });
 
  
  try {
    const account = await Account.findOne({ _id: req.params.id });
    withdraw.accountId = new mongoose.Types.ObjectId(account._id);
    account.current_balance = account.current_balance - withdraw.amount;
    if (account.current_balance < withdraw.amount) {
       return res.status(403).json({ message: `current balance is lesser than deposited  ${account.current_balance}`  });
    }
    if (account.current_balance) {
      withdraw.action = "withdraw"
    }
    withdraw.accountNumber = account.accountNumber;
    
    
    
    await withdraw.save();
    await account.save();
     



    

    
    res.status(200).json(withdraw);

 } catch (error) {
   res.status(500).json({success: false, msg:error.message });
 

 }




}
exports.deletewithdraw = async (req, res, next) => {
  Transaction.findOneAndDelete({
    _id: req.params.id
  }, function (err, task) {
    if (err)
      res.send(err);
    res.json({
      message: 'transaction successfully deleted'
    });
  });
}


exports.getWithdraw = async (req, res, next) => {
  try {
    
    const me = await Transaction.findById({
      _id: req.params.id
    });
    
  
  
    res.status(200).json(me);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getAllwithdraw = async (req, res, next) => {
  try {
    
    const all = await Transaction.find({action: 'withdraw'});
    res.status(200).json(all)
 
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
  
}
exports.deleteAllwithdraw = async (req, res, next) => {
  try {
    await Transaction.deleteMany({});
    res.status(200).json({
      message: 'successfully deleted'



    })
  } catch (error) {
    res.json({
      message: error.message
    });

  }

  
}