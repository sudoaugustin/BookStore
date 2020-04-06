const express = require('express');
const bcrypt = require('bcrypt');
const router  =express.Router();
const User    = require('../../models/User');
const Recover    = require('../../models/Recover');
router.post("/",(req,res)=>{
  const body=req.body,
             recover_id=body.recover_id
             password=body.password;
    Recover.findOne({_id:recover_id})
    .then(recover=>{
      if(recover){
        const curDate=new Date();
        const expired=Math.floor(((curDate-recover.date)/1000)/60)>10;
        if(!expired){
          User.findOne({_id:recover.user_id})
          .then(user=>{
            if(bcrypt.compareSync(password,user.password)) res._status(res.code.EXISTS);
            else{
              user.password=password;
              user.save()
              .then(()=>{
                Recover.deleteMany({user_id:user._id})
                .then(()=>{
                  res._status(res.code.OK);
                })
              })
            }
          });
        }
        else  res._status(res.code.NOT_FOUND);
      }
      else res._status(res.code.NOT_FOUND);
    })
    .catch(err=>res._status(res.code.SRV_ERR));
});

module.exports = router;
