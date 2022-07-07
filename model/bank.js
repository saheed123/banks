const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const { branchSchema } = require("./branch");
const bankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    
  },
  code: {
    type: Number
  },
  address: {
    type: String,
    required : true
  },
  branch: [{
    type: Schema.Types.ObjectId,
    ref : "Bank"
  }]
  ,
  zipCode: {                                   
    type: Number, 
    min: [10000, "Zip code too short"], 
    max: 99999 
  } ,
  email: {
    type: String
  }
  
  

});
const Bank = mongoose.model('Bank', bankSchema);
module.exports = {
  Bank, bankSchema
}
