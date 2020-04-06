const mongoose = require('mongoose');
const Schema   =mongoose.Schema;
const recover=new Schema({
  user_id:String,
  date:{
    type:Date,
    default:new Date()
  }
});
module.exports = Recover=mongoose.model('Recover',recover);
