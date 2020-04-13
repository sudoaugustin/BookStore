const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("config");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mail = config.get("mail");
const db = config.get("mongodbURL");
const status = require("./status");
const speakeasy = require("speakeasy");
const app = express();
const port = 8000; //process.env.PORT
const auth = require("./routes/auth");
const user = require("./routes/user");
const User = require("./models/User");
const Book = require("./models/Book");
const Order = require("./models/Order");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: mail,
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.static("public"));

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // res.setHeader("Access-Control-Allow-Credentials", true);
  res._status = (v) => {
    res.status(v).end();
  };
  res.code = status;
  res.mail = (msg, err, callback) => {
    msg.from = mail.user;
    transporter.sendMail(msg, function (error, info) {
      if (error) err ? err(error) : res._status(res.code.SRV_ERR);
      else callback ? callback() : res._status(res.code.OK);
    });
  };
  req.generateCode = (secret) =>
    speakeasy.totp({
      secret: secret,
      encoding: "base32",
    });
  req.verifyCode = ({ secret, code }) =>
    speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: code,
      window: 4,
    });
  next();
});

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Successfully connected to database"))
  .catch((err) => console.log(err));
app.use("/auth", auth);
app.use("/user", user);
app.get("/author/:authorId", async (req, res) => {
  const authorId = req.params.authorId;
  const user = await User.findOne({ _id: authorId });
  user.password = null;
  const books = await Book.find({ author: user._id });
  const orders = await Order.find({ author: authorId });
  console.log(orders);
  res.json({ user, books, orders });
});
app.post("/order", async (req, res) => {
  const { bookID, sendID, email, gateway } = req.body;
  const { author } = await Book.findOne({ _id: bookID });
  const newOrder = new Order({
    bookid: bookID,
    gateway,
    customer_email: email,
    customer_phone: sendID,
    author,
  });
  newOrder
    .save()
    .then((order) => res._status(200))
    .catch((err) => res._status(500));
});
app.listen(port, () => console.log("Server Started on " + port));
