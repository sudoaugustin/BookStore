import $ from "jquery";
import axios from "axios";
$(document).ready(()=>{
    $(".order--root bx-x").click(()=>$(".popover").fadeOut());
    $(".order--root .tab span").click(e=>{
        const ele=e.delegateTarget,
              status=ele.id,
              location_arr=window.location.href.split("/"),
              s_id=parseInt(location_arr[location_arr.length-1]);
        $(".order--root .tab span.active").removeClass("active");
        $(ele).addClass("active");
        axios.post("/management",{
            page:"orderByType",
            status,
            s_id
        })
        .then(res=>{
            const orders=res.data;
            const order_table=$(".order--root table");
            order_table.html("");
            order_table.append(`<tr>
                                    <td>Product</td>
                                    <td>Color</td>
                                    <td>Size</td>
                                    <td>Qty</td>
                                    <td></td>
                                </tr>`);
            orders.forEach(order => {
                const order_row=`<tr id=${order.o_id}>
                                 <td>
                                   <img src=${"../storage/products/"+order.product_img}>
                                   <span>${order.product_name}</spam>
                                 </td>
                                 <td id="clr">${order.color}</td>
                                 <td id="size">${order.size}</td>
                                 <td id="qty">${order.qty}</td>
                                 <td>
                                 ${status==="PENDING"?`<span id=${order.id} class="btn">Packed</span>`:``}
                                 </td>
                               </tr>`; 
                order_table.append(order_row);               
            });
            $(".order--root .btn").click(e=>{
                const id=e.delegateTarget.id;
                $("tr#"+id).fadeOut();
                axios.put("/order_specification/"+id,{
                    status:"PACKED"
                })
                .then(res=>console.log(res))
                .catch(e=>console.log(e.response));
            });
        })
        .catch(err=>console.log(err.response));
    });
    $(".order--root .tab span:first-child").click();
})