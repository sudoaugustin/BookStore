const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const School = require("../../models/School");
const Token = require("../../models/Token");

router.get("/checkEmail/:email", (req, res) => {
  const paras = req.params,
    email = paras.email;
  User.findOne({ email })
    .then(user => {
      const status = user ? res.code.EXISTS : res.code.OK;
      res._status(status);
    })
    .catch(err => res._status(res.code.SRV_ERR));
});

router.get("/checkSchool/:name", (req, res) => {
  const paras = req.params,
    name = paras.name;
  School.findOne({ name })
    .then(school => {
      const status = school ? res.code.EXISTS : res.code.OK;
      res._status(status);
    })
    .catch(() => res._status(res.code.SRV_ERR));
});

router.post("/create", (req, res) => {
  const body = req.body,
    newUser = new User({
      name: body.username,
      email: body.email,
      password: body.password
    });
  newUser
    .save()
    .then(user => {
      const newSchool = new School({
        name: body.schoolName,
        since: body.since,
        open: body.open,
        close: body.close,
        owner_id: user._id,
        busstop: body.busstop,
        address: {
          country: body.country,
          city: body.city,
          address_line: body.address,
          zip_code: body.zip
        }
      });
      newSchool
        .save()
        .then(school => {
          const newToken = new Token({
            user_id: user._id,
            device: body.device,
            ip_address: req.connection.remoteAddress,
            verified: true
          });
          newToken.save().then(token => {
            res.status(res.code.OK).json({
              token: token._id
            });
          });
        })
        .catch(err => {
          User.remove({
            _id: user._id
          }).then(() => res._status(res.code.SRV_ERR));
        });
    })
    .catch(err => {
      if (err.code == 11000) res._status(res.code.EXISTS);
      else res._status(res.code.SRV_ERR);
    });
});

module.exports = router;
