const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bill = new Schema({
  uid: String,
  gateway: String,
  accId: String,
  date: {
    type: Date,
    default: new Date(),
  },
});
module.exports = Bill = mongoose.model("bill", bill);
