const $=require("jquery");
const axios=require("axios");
$(document).ready(()=>{
      $(".item_view .right .checkout .size span").click(e=>{
          const ele=e.delegateTarget,data=JSON.parse($(e.delegateTarget).attr("data"));
          $(".item_view .right .checkout .size span").removeClass("active");
          $(ele).addClass("active");
          $(".item_view .right .checkout .color").html("");
          $(".item_view .left").html("");
          for (var item in data) {
            const img=document.createElement("img");
            img.name=item;
            img.src="/storage/products/"+data[item].img[0];
            $(".item_view .right .checkout .color").append(img);
          }
          $(".item_view .right .checkout .color img").click(e=>{
            const ele=e.delegateTarget,
                  name=ele.name,
                  item=JSON.parse($(".item_view .right .checkout .size span.active").attr("data"))[name];
            $("#price").html(item.price+"Ks");
            $(".item_view .right .checkout .add_to_cart").removeClass("added");
            $(".item_view .right .checkout .add_to_cart").html("Add to cart");
            $(".available").html(item.qty);
            $(".qtyC").html("1");
            $(".item_view .right .checkout .qty span i.bx-minus").addClass("disable");
            if(item.qty===1) $(".item_view .right .checkout .qty span i.bx-plus").addClass("disable");
            else $(".item_view .right .checkout .qty span i.bx-plus").removeClass("disable");
            $(".item_view .left").html("");
            item.img.forEach((img, i) => {
              const imgEle=document.createElement("img");
              imgEle.src="/storage/products/"+img;
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
        $(".popover").fadeOut();
      });
      $(".item_view .middle .title>span:last-child").click(e=>{
        $(".item_view .middle .title span:last-child i").toggleClass("bx-heart bxs-heart active");
        const likeEle=$(".item_view .middle .title>span:last-child span");
        var likes=parseInt(likeEle.html());
        $(".item_view .middle .title>span:last-child i").hasClass("active")?likes++:likes--;
        likeEle.html(likes);
        axios.post('likes',{
          liked:$(".item_view .middle .title span:last-child i").hasClass("bxs-heart active"),
          pId:$('.item_view .right .checkout .add_to_cart').attr('id')
        }).catch(err=>console.log(err.response));
      });
      $(".item_view .right .checkout .qty span i.bx-plus").click(e=>{
        const maxQty=parseInt($(".available").html());
        var qty=parseInt($(".qtyC").html());
        if(qty!==0){
          if(maxQty>qty) {
            $(".item_view .right .checkout .qty span i.bx-minus").removeClass("disable");
            $(".item_view .right .checkout .qty span i.bx-plus").removeClass("disable");
            qty++;
          }
          $(".qtyC").html(qty.toString());
          if(maxQty==qty) $(".item_view .right .checkout .qty span i.bx-plus").addClass("disable");
        }
      });
      $(".item_view .right .checkout .qty span i.bx-minus").click(e=>{
        var qty=parseInt($(".qtyC").html());
        if(qty>1) {
          $(".item_view .right .checkout .qty span i.bx-plus").removeClass("disable");
          $(".item_view .right .checkout .qty span i.bx-minus").removeClass("disable");
          qty--;
        }
        $(".qtyC").html(qty.toString());
        if(qty==1) $(".item_view .right .checkout .qty span i.bx-minus").addClass("disable");
      });
      $(".item_view .right .checkout .add_to_cart").click(e=>{
        var id=e.delegateTarget.id;
        var cart=JSON.parse(sessionStorage.getItem("itm_in_cart")) || [],index=cart.length;
        $(".item_view .right .checkout .add_to_cart").toggleClass("added");
        if($(".item_view .right .checkout .add_to_cart").hasClass("added")) {
          $(".item_view .right .checkout .add_to_cart").html("Remove from cart");
          cart.push({
            index,
            id:parseInt(id),
            color:$(".item_view .right .checkout .color img.active").attr("name"),
            size:$(".item_view .right .checkout .size span.active").html(),
            qty:parseInt($('.qtyC').html()),
            img:$('.item_view .current_item_img img').attr("src"),
            price:$('.item_view .right .detail #price').html()
          });
        }
        else {
          $(".item_view .right .checkout .add_to_cart").html("Add to cart");
          cart.splice(index-1,1);
        }
        console.log("CART");
        console.log(cart);
        sessionStorage.setItem("itm_in_cart",JSON.stringify(cart));
        if(Object.keys(cart).length) $("nav ul li#cart").addClass("noti");
        else $("nav ul li#cart").removeClass("noti");
      });
});