const mongoose = require('mongoose');
const shortid        =require('shortid');
const Schema   =mongoose.Schema;
const verification=new Schema({
  user_id:String,
  code:{
    type:String,
    default:shortid.generate
  }
});
module.exports = Verification=mongoose.model('Verification',verification);
