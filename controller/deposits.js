const { Branch } = require('../model/branch');
const {Account} = require('../model/account');
const { Transaction } = require('../model/transaction');

const mongoose = require('mongoose');

const {
  validationResult
} = require('express-validator');
exports.deposit = async (req,res, next)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
   
  
  const deposit = new Transaction({
    ...req.body
    
  });
 
  
  try {
    const account = await Account.findOne({ _id: req.params.id });
    deposit.accountId = new mongoose.Types.ObjectId(account._id);
    account.current_balance = deposit.amount + account.current_balance;
    if (account.current_balance) {
      deposit.action = "deposit"
    }
    deposit.accountNumber = account.accountNumber;
    
    
    
    await deposit.save();
    await account.save();
     



    

    
    res.status(200).json(deposit);

 } catch (error) {
   res.status(500).json({success: false, msg:error.message });
 

 }




}
exports.deleteDeposit = async (req, res, next) => {
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


exports.getDeposit = async (req, res, next) => {
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

exports.getAllDeposit = async (req, res, next) => {
  try {
    
  const all = await Transaction.find({action: 'deposit'});
 return res.status(200).json(all);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
  
}
exports.deleteAllDeposit = async (req, res, next) => {
  try {
    await Transaction.deleteMany({action : 'deposit'});
    res.status(200).json({
      message: 'successfully deleted'



    })
  } catch (error) {
    res.json({
      message: error.message
    });

  }

  
}