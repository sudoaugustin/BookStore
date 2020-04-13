const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const Schema = mongoose.Schema;
const status = require("../status");
const user = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 5,
    maxlength: 20,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
    set: (v) => bcrypt.hashSync(v, 10),
    minlength: 8,
  },
  phone: {
    // ?default: [" "],
    type: Array,
  },
  status: {
    type: Number,
    default: status.NOT_VERIFIED,
  },
  since: {
    type: Date,
    default: new Date(),
  },
  secret: {
    type: String,
    default: speakeasy.generateSecret({ length: 20 }).base32,
    unique: true,
  },
  avatar: String,
  bill: { type: Number, default: 0 },
  payments: {
    kbzbank: String,
    cbbank: String,
    kbzpay: String,
    cbpay: String,
    wave: String,
  },
});
module.exports = User = mongoose.model("User", user);
