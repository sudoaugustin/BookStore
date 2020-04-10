const $ = require('jquery');
$(document).ready(e=>{
  $(".exchange .bx-x").click(e=>{
    $(".popover").removeClass("show").html();
  });
  $(".payments p").click(e=>{
    var ele=e.delegateTarget
        id =ele.id;
    $(".payments p.active i").toggleClass("bx-radio-circle  bx-radio-circle-marked");
    $(".payments p.active").removeClass("active");
    $(ele).addClass("active");
    $(".payments p.active i").toggleClass("bx-radio-circle  bx-radio-circle-marked");
  });
  $(".payments p:first-child").click();
});
