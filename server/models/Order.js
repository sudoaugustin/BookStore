const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const order = new Schema({
  bookid: String,
  gateway: String,
  customer_email: String,
  customer_phone: String,
  author: String,
  date: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: String,
    default: "pending",
  },
});

module.exports = Order = mongoose.model("Order", order);
