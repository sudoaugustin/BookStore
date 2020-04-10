const $=require('jquery');
const axios=require('axios');
$(document).ready(()=>{
    $(".products--upload i.bx-plus").click(e=>{
        var location_arr=window.location.href.split("/"),
            s_id=parseInt(location_arr[location_arr.length-1]);
        axios.post("/management",{
            page:"productUpload",
            s_id
        })
        .then(res=>$('.popover').hide().html(res.data).fadeIn())
        .catch(err=>console.log(err.response));
    });
    $('.item_card').click(e=>{
        const p_id=e.delegateTarget.id;
        axios.post("/management",{
            p_id,
            page:"productById"
        }).then(res=>{
            $(".popover").html(res.data);
            $(".checkout #price").on("input",e=>{
                e.delegateTarget.style.width = ((e.delegateTarget.value.length + 1) * 9) + 'px';
            });
            $(".item_view .right .checkout .size span").click(e=>{
                const ele=e.delegateTarget,data=JSON.parse($(e.delegateTarget).attr("data"));
                $(".item_view .right .checkout .size span").removeClass("active");
                $(ele).addClass("active");
                $(".item_view .right .checkout .color").html("");
                $(".item_view .left").html("");
                for (var item in data) {
                  const img=document.createElement("img");
                  img.name=item;
                  img.src="../storage/products/"+data[item].img[0];
                  $(".item_view .right .checkout .color").append(img);
                }
                $(".item_view .right .checkout .color img").click(e=>{
                  const ele=e.delegateTarget,
                        name=ele.name,
                        item=JSON.parse($(".item_view .right .checkout .size span.active").attr("data"))[name];
                  $("#price").val(item.price);
                  $("#price").css("width",(($("#price").val().length + 1) * 8) + 'px');
                  $(".qtyC").html(item.qty);
                  $(".item_view .right .checkout .update_product").html("Update product");
                  (item.qty>0)?
                  $(".item_view .right .checkout .qty span i.bx-minus").removeClass("disable"):
                  $(".item_view .right .checkout .qty span i.bx-minus").addClass("disable");
                  $(".item_view .left").html("");
                  item.img.forEach((img, i) => {
                    const imgEle=document.createElement("img");
                    imgEle.src="../storage/products/"+img;
                    $(".item_view .left").append(imgEle);
                  });
                  $(".item_view .right .checkout .color img").removeClass("active");
                  $(ele).addClass("active");
                  $(".item_view .left img").click(e=>{
                    const ele=e.delegateTarget,src=ele.src;
                    $(".item_view .left img.active").removeClass("active");
                    $(ele).addClass("active");
                    $(".middle .current_item_img img").attr("src",src);
                  });
                  $(".item_view .left img:first-child").click();
                });
                $(".item_view .right .checkout .color img:first-child").click();
            });
            $(".item_view .right .checkout .size span:first-child").click();
            $(".item_view .bx-x").click(e=>{
              $(".kit i:first-child").click();
            });
            $(".item_view .right .checkout .qty span i.bx-plus").click(e=>{
                const maxQty=parseInt($(".available").html());
                var qty=parseInt($(".qtyC").html());
                $(".item_view .right .checkout .qty span i.bx-minus").removeClass("disable");
                qty++;
                parseInt($(".qtyC").html(qty));
            });
            $(".item_view .right .checkout .qty span i.bx-minus").click(e=>{
                var qty=parseInt($(".qtyC").html());
                if(qty>0) {
                    $(".item_view .right .checkout .qty span i.bx-plus").removeClass("disable");
                    $(".item_view .right .checkout .qty span i.bx-minus").removeClass("disable");
                    qty--;
                }
                $(".qtyC").html(qty.toString());
                if(qty==0) $(".item_view .right .checkout .qty span i.bx-minus").addClass("disable");
            });
            $(".item_view .right .checkout .update_product").click(e=>{
                var id=e.delegateTarget.id,
                    item={
                    name:$(".middle input[type=text]").val(),
                    id,
                    color:$(".item_view .right .checkout .color img.active").attr("name"),
                    size:$(".item_view .right .checkout .size span.active").html(),
                    qty:$('.qtyC').html(),
                    price:parseInt($('.item_view .right  #price').val())
                };
                axios.put("/product/"+id,item)
                .then(res=>{
                    $(".item_view .right .checkout .update_product").html("Updated!");
                    setTimeout(()=>$(".item_view .right .checkout .update_product").html("Update product")
                    ,1500);
                })
                .catch(err=>console.log(err.response));
            });
            $(".item_view .right .checkout .drop_product").click(e=>{
                var id=e.delegateTarget.id;
                axios.delete("/product/"+id)
                .then(res=>{
                    $(".item_view .bx-x").click();
                })
                .catch(err=>console.log(err.response));
            });
        }).catch(err=>console.log(err.response));
    });
});


