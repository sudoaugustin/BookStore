const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const mail = config.get("mail");
const db = config.get("mongodbURL");
const status = require("./status");
var speakeasy = require("speakeasy");
const app = express();
const port = 8000; //process.env.PORT
const auth = require("./routes/auth");
const user = require("./routes/user");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: mail
});
app.use(bodyParser.json({ limit: "50mb" }));

app.use((req, res, next) => {
  res._status = v => {
    res.status(v).end();
  };
  res.code = status;
  res.mail = msg => {
    msg.from = mail.user;
    transporter.sendMail(msg, function(error, info) {
      if (error) res._status(res.code.SRV_ERR);
      else res._status(res.code.OK);
    });
  };
  req.generateCode = secret =>
    speakeasy.totp({
      secret: secret,
      encoding: "base32"
    });
  req.verifyCode = ({ secret, code }) =>
    speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: code,
      window: 4
    });
  next();
});

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log("Successfully connected to database"))
  .catch(err => console.log(err));
// app.use("/user",user);
app.use("/auth", auth);
app.use("/user", user);
app.listen(port, () => console.log("Server Started on " + port));
