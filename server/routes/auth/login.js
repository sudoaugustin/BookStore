const express = require('express');
const router  =express.Router();
const User    = require('../../models/User');
const Token  = require('../../models/Token');
const bcrypt = require('bcrypt');

router.post("/",(req,res)=>{
  const body=req.body,
        email=body.email,
        password=body.password;
  User.findOne({email})
  .then(user=>{
    if(!user) res._status(res.code.NOT_EXIST);
    else {
      if(bcrypt.compareSync(password,user.password)){
        const newToken=new Token({
          user_id:user._id,
          device:body.device,
          ip_address:req.connection.remoteAddress,
          verified:true
         });
        newToken.save()
        .then(token=>{
          res.json({
            token:token._id
           });
         });
      }
      else  res._status(res.code.UNAUTH);
    }
  })
  .catch(()=>res._status(res.code.SRV_ERR));
});

module.exports = router;
