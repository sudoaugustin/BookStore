const express = require("express");
const app = express();
const Token = require("../../models/Token");
const User = require("../../models/User");
const School = require("../../models/School");
const status = require("../../status");
app.use((req, res, next) => {
  req.token = req.header("x-auth-token");
  Token.findOne({ _id: req.token })
    .then(token => {
      if (token) {
        req.uid = token.user_id;
        next();
      } else res._status(status.NOT_EXIST);
    })
    .catch(err => {
      // !console.log(err);
      res._status(status.SRV_ERR);
    });
});
app.get("/", async (req, res) => {
  const user = await User.findOne({ _id: req.uid });
  const school = await School.findOne({ owner_id: req.uid });
  res.json({ user, school });
});

app.post("/uploadProfile", (req, res) => {
  School.findOne({ owner_id: req.uid }).then(school => {
    school.avatar = req.body.avatar;
    school.save().then(() => res._status(200));
  });
});
module.exports = app;
