const $ = require('jquery');
$(document).ready(()=>{
  $('.bx-chevron-down').click((e)=>{
    const target=e.target,
    id=target.id;
    console.log($("#"+id).toggleClass);
    $(".bx-chevron-down#"+id).toggleClass("upward");
    $(".content#"+id).toggleClass("show");
  })
})
