const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const book = new Schema({
  author: {
    type: String,
    required: true,
  },
  name: String,
  img: String,
  description: String,
  category: String,
  price: Number,
  file: String,
  pages: Number,
  date: {
    type: Date,
    default: new Date(),
  },
});

module.exports = Book = mongoose.model("Book", book);
