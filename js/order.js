const $=require('jquery');
const axios = require('axios');
$(document).ready(()=>{
  $(".order_title span").click((e)=>{
    const target=e.target;
    $(".order_title span.active").removeClass("active");
    $(".order_title span#"+target.id).addClass("active");
    axios.get("order/type:"+target.id).then(res=>{
      $("table.order").html(res.data);
      $('.bx-dots-horizontal-rounded').click(e=>{
        axios.get("order/id:"+e.target.id)
        .then(res=>{
          const popover=$(".popover");
          popover.css("display","flex").hide().fadeIn().html(res.data);
          $(".voucher .bx-x").click(()=>{
            popover.fadeOut();
          })
        })
      });
    }).catch(e=>console.log(e.response));
  });
  $(".order_title span#pending").click();
})
