const express = require('express');
const router  =express.Router();
const config =require('config');
const User    = require('../../models/User');
const Recover    = require('../../models/Recover');
router.get("/reqCode/:email",(req,res)=>{
  const paras=req.params,
        email=paras.email;
  User.findOne({email})
  .then(user=>{
    //ACCOUNT EXISTS
    if(user) {
        var code = req.generateCode(user.secret);
        const message={
          to:user.email,
          subject: 'Account verification code',
          html:`<h1>${code}</h1>`
        };
        res.mail(message);

    }
    else res._status(404);
  })
  .catch(err=>res.status(500));
});

router.post("/verifyCode",(req,res)=>{
  const body=req.body,
             email=body.email,
             code=body.code;
    User.findOne({email})
    .then(user=>{
      if(user){
        var isValid = speakeasy.totp.verify({
          secret: user.secret,
          encoding: 'base32',
          token: code,
          window:4
        });
        if(isValid) {
          Recover.deleteMany({user_id:user._id})
          .then(count=>{
            const newRecover=new Recover({
              user_id:user._id
            });
            newRecover.save()
            .then(recover=>{
              res.send(recover._id);
            });
          })
        }
        else res._status(401);
      }
      else res._status(404);
    })
    .catch(err=>res._status(500));
});

module.exports = router;
