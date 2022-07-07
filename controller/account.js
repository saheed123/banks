const {

  User
} = require('../model/user');
const {
  Branch
} = require("../model/branch");
const {
  Account
} = require("../model/account");
const mongoose = require('mongoose');

var digits = Math.floor(Math.random() * 9000000000 + 1000000000);

// async function getNextValue(sequenceName) {

//   const filter = { _id: sequenceName };
//   const update = { $inc: { sequence_value: 1 } };
//   const sequence = await Counter.findByIdAndUpdate(filter, update, { setDefaultsOnInsert: true, upsert: true, new: true, $set: {sequence_value : 75432}});
//   return sequence.sequence_value;
// }

const {
  validationResult
} = require('express-validator');
exports.openAccount = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  
  const account = new Account(req.body);
  account.user = req.user._id;
  account.accountName = `${req.user.firstname} ${req.user.lastname} ${req.user.othernames}`;
  account.email = req.user.email;
  account.current_balance = 0;
  account.accountNumber = digits++;
  try {

    await account.save();

    const user = await User.findById({
      _id: account.user
    });
    user.account.push(account);
    await user.save();
    res.status(200).json({
      success: true,
      account
    });
    const branch = await Branch.findOne({});
    branch.accountId.push(account);
    await branch.save()

  } catch (ex) {
    for (field in ex.errors)
      res.status(500).json({
        success: false,
        msg: ex.errors[field].message
      });


  }




}
exports.DeleteAccount = async (req, res, next) => {
  try {
    const objid = mongoose.Types.ObjectId(req.params.id);
    await Account.findOneAndDelete({
      user: objid
    });
    const user = await User.findOne({
      _id: objid
    });

    await user.account.pull(objid);
    user.save();
    const branch = await Branch.findOne({});
    branch.accountId.pull(objid);
    
    res.status(200).json({
      message: 'successfully deleted'



    })
  } catch (error) {
    res.json({
      message: error.message
    });

  }






}

exports.DeleteAllAccount = async (req, res, next) => {

  try {
    const user = await User.findOne({});
    user.account = [];
    await user.save();
    await Account.deleteMany({});
    const acc = await Branch.findOne({});
    acc.accountId = [];
    await acc.save();

    res.status(200).json({
      message: 'successfully deleted'



    })
  } catch (error) {
    res.json({
      message: error.message
    });

  }








}
exports.allAccount = async (req, res, next) => {
  try {
    const all = await Account.find({});
    all ? res.status(200).json(all) : res.json({
      message: 'nothing found'
    });


  } catch (error) {
    res.json({
      message: error.message
    });
  }





}