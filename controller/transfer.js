const {
  Branch
} = require('../model/branch');
const {
  Account
} = require('../model/account');
const {
  Transaction
} = require('../model/transaction');
const mongoose = require('mongoose');










const {
  validationResult
} = require('express-validator');
exports.transfer = async (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  const transfer = new Transaction({ ...req.body });
 try {
    
  const acc = await Account.findOne({_id : req.params.id});
  transfer.accountNumber = acc.accountNumber;
   transfer.accountId = new mongoose.Types.ObjectId(acc._id);
   transfer.action = 'transfer';                  
  await Account.findOneAndUpdate({
    accountNumber: transfer.from
  }, {
    $inc: {
      current_balance: - transfer.amount
    }
} );
await Account.findOneAndUpdate({
    accountNumber: transfer.to
  }, {
    $inc: {
      current_balance: transfer.amount
    }
  });
   await transfer.save()
   res.status(200).json({ transfer });
 } catch (error) {
    res.status(500).json({message : error.message});



  }

 
  
}



  

exports.deleteTransfer = async (req, res, next) => {
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


exports.getTransfer = async (req, res, next) => {
  try {

    const me = await Transaction.findById({
      _id: req.params.id
    });
  res.status(200).json(me);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

exports.getAllTransfer = async (req, res, next) => {
  try {

    const all = await Transaction.find({
      action: 'transfer'
    });
    return res.status(200).json(all);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
    console.log(error.message);
  }

}
exports.deleteAllTransfer = async (req, res, next) => {
  try {
    await Transaction.deleteMany({
      action: 'transfer'
    });
    res.status(200).json({
      message: 'successfully deleted'



    })
  } catch (error) {
    res.json({
      message: error.message
    });

  }


}