const {
  User
} = require('../model/user');
const {
  Account
} = require('../model/account');
const {
  Transaction
} = require('../model/transaction');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
var digits = Math.floor(Math.random() * 9000000000 + 1000000000);


const {
  validationResult
} = require('express-validator');
exports.postAgent = async (req, res, next) => {





  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  var user = new User(req.body);





  if (user.Agent === false) {
    return res.status(403).json({
      message: 'you are not an agent yet'
    });


  }








  user.password = await bcrypt.hash(user.password, 10);
  user.confirm = user.password;
  const fullname = user.fullname();
  const token = user.generateToken();
  user.account = [];
  user.AgentCode = digits++;
  user.image = req.file.path;
  user.isApproved = false;







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
      message: "thank you for contacting us, you request approval will be granted after thorough verification"

    });
  } catch (ex) {
    res.status(500).json({
      message: ex.message
    });

  }




}
exports.loginAgent = async (req, res, next) => {
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
    if (user.isApproved === true) {
      return res.header('x-auth-token', accessToken).status(200).json({
        ...other,
        accessToken
      });
    }
    

    res.status(202).json({
      message: 'your request is still waiting approval'
    });








  } catch (error) {
    res.status(500).json(error.message);

  }





}
exports.updateAgent = async (req, res) => {


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
exports.deleteAgent = async (req, res, next) => {

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
exports.findAgent = async (req, res, next) => {
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
exports.findallAgent = async (req, res, next) => {
  try {
    const all = await User.find({
      Agent: true
    }).select("-password -confirm -isAdmin").sort('1');


    return res.status(200).json(all);



  } catch (error) {

    next();


  }






}
exports.agentRequestList = async (req, res, next) => {
  try {
    let user = await User.findOne({_id: req.user._id});
    if (!user) {
      return res.status(422).json({ message: "invalid user" });
    }
    if (user) {
      let agent = await User.find({ isApproved: false }).select("-password -confirm");
      return res.status(200).json(agent);
   }
    return res.status(422).json({ message: "unauthorised user" });



  } catch (error) {

    return res.status(500).json({ message: error.message });


  }






}


exports.approveAgent = async (req, res, next) => {
  const user = await User.findOne({_id : req.user._id});
  if (!user) {
    res.status(422).json({ message: "invalid user" });
  }

  try {
    if (user.isAdmin === true) {
      let use = await User.findOne({ _id: req.params.id });
      if (!use) {
        return res.status(404).json({ message: "agent not found" });
      }
      const docs = await User.findByIdAndUpdate(req.params.id, {isApproved: true}, {new : true});
      if (!docs) {
        res.status(401).json({ message: 'unapproved user' });
      }
      res.status(200).json({docs, message: 'approved agent successsfully' });

   }
  } catch (error) {
    res.status(500).json({
      message: error.message
    });



  }



}

