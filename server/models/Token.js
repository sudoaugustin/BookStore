const mongoose = require('mongoose');
const Schema=mongoose.Schema;
const token=new Schema({
  user_id:String,
  device:String,
  ip_address:String,
  verified:{
    type:Boolean,
    default:false
  }
});
module.exports = Token=mongoose.model('Token',token);
