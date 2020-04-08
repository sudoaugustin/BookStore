const express = require("express");
const router = express.Router();
const User = require("../../models/User");

// User.findOne({ email })
// .then((user) => {
//   const status = user ? res.code.EXISTS : res.code.OK;
//   res._status(status);
// })
// .catch((err) => res._status(res.code.SRV_ERR));
router.post("/", (req, res) => {
  const body = req.body,
    newUser = new User({
      name: body.username,
      email: body.email,
      password: body.password,
    });
  newUser
    .save()
    .then((user) => {
      var code = req.generateCode(user.secret);
      const message = {
        to: user.email,
        subject: "Account verification code",
        html: `<h1>${code}</h1>`,
      };
      res.mail(message);
    })
    .catch((err) => {
      console.log(err);
      if (err.code == 11000) res._status(res.code.EXISTS);
      else res._status(res.code.SRV_ERR);
    });
});
module.exports = router;
