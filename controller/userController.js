const {
  User
} = require('../model/user');
const { Branch } = require('../model/branch');

const bcrypt = require('bcrypt');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');




const {
  validationResult
} = require('express-validator');
exports.postUser = async (req, res, next) => {

  

  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  
  var user = new User(req.body);
  
  
  
  user.password = await bcrypt.hash(user.password, 10);
  user.confirm = user.password;
  const token = user.generateToken();
  const fullname = user.fullname();
  user.account = [];
  user.loans = [];
  

  user.image = req.file.path;
  const {
    _id,
    password,
    confirm,
    ...other
  } = user._doc;
  try {
    
    const branch = await Branch.findOne({});
    if ( user.branch_code === branch.branch_code) {
      branch.User.push(user)
      
    }
    if (user.branch_code !== branch.branch_code) {
      return res.status(403).json({ message: 'you must be affiliated with a branch visit a branch to seeek for branch code and register' });
      
    }
    if (!user.branch_code) {
      return res.status(400).json({ message: 'please input your branch code' });
    }
    await branch.save();
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
exports.loginUser = async (req, res, next) => {
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
exports.updateUser = async (req, res) => {


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
exports.deleteUser = async (req, res, next) => {
  
  try {
    
     

    await User.findByIdAndDelete({ _id: req.user._id });
    await Account.deleteMany({ user: req.user._id});
    return res.status(200).json({ message: 'successfully deleted' });
    


  } catch (error) {
    
    next();

  }









  










}
exports.findUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      _id: req.user._id
    });
    const { password, confirm,isAdmin,...other } = user._doc;
  
  
    res.status(200).json({ ...other });  
  }
  catch (error) {
    res.status(500).jon({ message: error.message });
  }
  
}
exports.logout = async (req, res, next) => {
  req.user = "";
  res.status(200).json({
    message: 'logout successfull'
  });

}
exports.findall = async (req, res, next) => {
  
  try {
    const user = await User.find({}, '-confirm -password -isAdmin' );
    


    return res.status(200).json(user);



  } catch (error) {

    return res.status(500).json({ message : error.message });


  }






}