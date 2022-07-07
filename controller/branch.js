const { Branch } = require('../model/branch');
const { Bank } = require('../model/bank');
const mongoose = require('mongoose');
var digits = Math.floor(Math.random() * 100 + 10);
const {
  validationResult
} = require('express-validator');
exports.addBranch = async (req,res, next)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
   
  
  const branch = new Branch({
    ...req.body
    
  });
  
 
  
  try {
    branch.branch_code = digits++;
    
    const save = await branch.save();
    const  branches = save;
    const bank = await Bank.findOne({});
    
    const banks = bank;
    branches.Bank = new mongoose.Types.ObjectId(banks._id) ;
    banks.branch.push(branches);
    await bank.save();
    await branch.save();
    
     



    

    
    res.status(200).json(branch);

 } catch (error) {
   res.status(500).json({success: false, msg:error.message });
 

 }




}
exports.DeleteBranch = async (req, res, next) => {
  Branch.findOneAndDelete({
    _id: req.user._id
  }, function (err, task) {
    if (err)
      res.send(err);
    res.json({
      message: 'branch successfully deleted'
    });
  });
}


exports.getABranch = async (req, res, next) => {
  try {
    
    const user = await Branch.findById({
      _id: req.params.id
    });
    
  
  
    res.status(200).json({user});  
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

exports.getAllBranch = async (req, res, next) => {
  try {
    
  const all = await Branch.find({});
 return res.status(200).json(all);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error.message);
  }
  
}
exports.deleteAllBranch = async (req, res, next) => {
  try {
    const bank = await Bank.findOne({});
    await Branch.deleteMany({
      bank: new mongoose.Types.ObjectId(bank._id)
    });
     bank.branch = [];
    bank.save();
    res.status(200).json({
      message: 'successfully deleted'



    })
  } catch (error) {
    res.json({
      message: error.message
    });

  }

  
}