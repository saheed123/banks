const { Bank } = require('../model/bank');
const mongoose = require('mongoose');


const {
  validationResult
} = require('express-validator');
exports.addBank = async (req,res, next)=> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(
      errors.array()
    );
  }
  const bank = new Bank(req.body );
  bank.branch = [];
  const {
    _id,
    ...other
  } = bank._doc;
 
  
  try {
    
    await bank.save();
    res.status(200).json({
      ...other
      
    });

 } catch (error) {
   res.status(500).json({success: false, msg:error.message });
 

 }




}
