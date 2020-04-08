const express = require("express");
const router = express.Router();
// const config = require("config");
const User = require("../../models/User");
// const Recover = require("../../models/Recover");
router.post("/", (req, res) => {
  const body = req.body,
    email = body.email,
    code = body.code;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        var isValid = req.verifyCode({
          secret: user.secret,
          code,
        });
        if (isValid) {
          user.status = res.code.OK;
          user.save().then(() => res._status(res.code.OK));
        } else res._status(401);
      } else res._status(404);
    })
    .catch((err) => res._status(500));
});

router.post("/reqCode", (req, res) => {
  const body = req.body,
    email = body.email;
  User.findOne({ email })
    .then((user) => {
      //ACCOUNT EXISTS
      if (user) {
        var code = req.generateCode(user.secret);
        const message = {
          to: user.email,
          subject: "Account verification code",
          html: `<h1>${code}</h1>`,
        };
        res.mail(message);
      } else res._status(404);
    })
    .catch((err) => res.status(500));
});

module.exports = router;
