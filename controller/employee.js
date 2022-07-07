const {
  User
} = require('../model/user');
const { Account } = require('../model/account');
const { Transaction } = require('../model/transaction');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
var digits = Math.floor(Math.random() * 9000000000 + 1000000000);


const {
  validationResult
} = require('express-validator');
exports.postEmployee = async (req, res, next) => {





  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  var user = new User(req.body);
  

 


  if (user.staff === false) {
    return res.status(403).json({ message: 'you are not an agent or employee' });
    
    
  }
  






  user.password = await bcrypt.hash(user.password, 10);
  user.confirm = user.password;
  const fullname = user.fullname();
  const token = user.generateToken();
  user.account = [];
  user.staffCode = digits++;
  user.image = req.file.path;







  const {
    _id,
    password,
    confirm,
    ...other
  } = user._doc;
  try {
    await user.save();
    res.header('x-auth-token', token).status(200).json({
      ...other,
      token,
      fullname,

    });
  } catch (ex) {
    next(ex);

  }




}
exports.loginEmployee = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }
  try {

    const user = await User.findOne({
      email: req.body.email
    });
    if (!user)
      return res.status(400).send('invalid!!! email not registered');
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    if (!validatePassword) {
      return res.status(400).send('invalid password');
    }
    if (user.staff === false) {
      return  res.status(403).json({ message: 'you are not an employee' });
        
    }
    
    const accessToken = user.generateToken();


    const {
      _id,
      password,
      confirm,
      city,
      address,
      ...other
    } = user._doc;
    res.header('x-auth-token', accessToken).status(200).json({
      ...other,
      accessToken
    });





  } catch (error) {
    res.status(500).json(error.message);

  }





}
exports.updateEmployee = async (req, res) => {


  if (req.body.password) {
    req.body.password = bcrypt.hash(req.body.password, 10)
  }
  try {
    const updateUser = await User.findOneAndUpdate(req.user._id, {
      $set: req.body
    }, {
      new: true
    });
    updateUser ? res.status(200).json({
      message: 'successfully updated'
    }) : res.status(400).json({
      message: 'not found'
    });

  } catch (error) {
    res.status(500).json(error);

  }

}
exports.deleteEmployee = async (req, res, next) => {

  try {



    await User.findByIdAndDelete({
      _id: req.user._id
    });
    return res.status(200).json({
      message: 'successfully deleted'
    });



  } catch (error) {

    next();

  }




















}
exports.findEmployee = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id
    });
    const {
      password,
      confirm,
      isAdmin,
      ...other
    } = user._doc;


    res.status(200).json({
      ...other
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }

}
exports.findallEmployee = async (req, res, next) => {
  try {
    const all = await User.find({staff : true}).select("-password -confirm -isAdmin").sort('1');


    return res.status(200).json(all);



  } catch (error) {

    next();


  }






}
exports.depositforUser = async (req, res, next) => {
  const deposit = new Transaction({ ...req.body });
  const account = await Account.findOne({ _id: req.params.id });
  deposit.accountId = new mongoose.Types.ObjectId(account._id);
  const user = await User.findOne({});
  if (user.staff === true) {
    account.current_balance = deposit.amount + account.current_balance;
    if (account.current_balance) {
      deposit.action = "deposit"
    }
    deposit.accountNumber = account.accountNumber;
    deposit.staffCode = user.staffCode;
    deposit.accountName = account.accountName;


  }
  await deposit.save();
  await account.save();
  res.status(200).json({deposit });
}
exports.employeeTransfer = async (req, res, next) => {
  const user = await User.findOne({});
  const transfer = new Transaction({ ...req.body });
 
  try {
    if (user.staff === true) {
      
      const acc = await Account.findOne({ _id: req.params.id });
      transfer.accountNumber = acc.accountNumber;
      transfer.accountId = new mongoose.Types.ObjectId(acc._id);
      transfer.action = 'transfer';
      await Account.findOneAndUpdate({
        accountNumber: transfer.from
      }, {
        $inc: {
          current_balance: - transfer.amount
        }
      });
      await Account.findOneAndUpdate({
        accountNumber: transfer.to
      }, {
        $inc: {
          current_balance: transfer.amount
        }
      });
    }
   await transfer.save()
   res.status(200).json({ transfer });
 } catch (error) {
    res.status(500).json({message : error.message});



  }

 
  
}