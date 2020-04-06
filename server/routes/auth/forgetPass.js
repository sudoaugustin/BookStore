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
          subject: 'Password change requests',
          html:`<h1>${code}</h1>`
        };
        res.mail(message);
    }
    else res._status(res.code.NOT_FOUND);
  })
  .catch(err=>res.status(res.code.SRV_ERR));
});

router.post("/verifyCode",(req,res)=>{
  const body=req.body,
             email=body.email,
             code=body.code;
    User.findOne({email})
    .then(user=>{
      if(user){
        var isValid = req.verifyCode({
          secret:user.secret,
          code
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
        else res._status(res.code.UNAUTH);
      }
      else res._status(res.code.NOT_FOUND);
    })
    .catch(err=>res._status(res.code.SRV_ERR));
});

module.exports = router;
