const express = require('express');
const router  =express.Router();
const Token  = require('../../models/Token');

router.delete("/:token",(req,res)=>{
  const _id=req.params.token;
  Token.deleteOne(_id)
  .then(()=>{
    res._status(req.code.OK);
  })
  .catch(()=>res._status(req.code.SRV_ERR))
})

module.exports = router;
