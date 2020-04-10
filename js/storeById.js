const $ = require('jquery');
const axios = require('axios');
const explore=require('./explore');
$(document).ready(e=>{
  $(".subscribe--btn").click(e=>{

    const ele=e.delegateTarget,s_id=ele.id;
    $(`.subscribe--btn`).toggleClass("subscribe unsubscribe");
    var subscribed=$(ele).hasClass("unsubscribe");
    subscribed?$(`.subscribe--btn`).html("Unsubscribe"):$(`.subscribe--btn`).html("Subscribe");
    axios.post("/subscribe",{
      s_id,
      subscribed
    });
  });
  $(".rating i").click(e=>{
    if($(".rating").hasClass("clickable")){
      var ele=e.delegateTarget,id=parseInt(ele.id),rate=0;
      for (var i = 0; i < 6; i++) {
        let ele=$(".rating i#"+i);
        if(i<id){
          ele.removeClass('bx-star');
          ele.addClass('bxs-star');
        }
        else if(i==id) {
          id===1?ele.toggleClass('bxs-star bx-star'):(ele.addClass('bxs-star'),ele.removeClass('bx-star'));
        }
        else if (i>id) {
          if(ele.hasClass("bxs-star")){
            ele.removeClass('bxs-star');
            ele.addClass('bx-star');
          }
        }
      }
      var rate=(id==1) ? $(".rating i#"+id).hasClass('bxs-star'):id,
          s_id=$(".subscribe--btn").attr("id");
          console.log(rate);
      axios.post('/rate',{
        rate,
        s_id
      }).then(res=>console.log(res.data))
      .catch(err=>console.log(err.response));
    }
  });
  $(".bx-arrow-back").click(e=>{
    $("nav ul li.active").click();
  });
});
