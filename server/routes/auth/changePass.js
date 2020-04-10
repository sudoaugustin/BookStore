const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../../models/User");
router.post("/", (req, res) => {
  const body = req.body,
    email = body.email;
  password = body.password;
  User.findOne({ email }).then((user) => {
    if (bcrypt.compareSync(password, user.password))
      res._status(res.code.EXISTS);
    else {
      user.password = password;
      user.save().then(() => res._status(res.code.OK));
    }
  });
});

module.exports = router;
