const $ = require("jquery");
const axios = require("axios");
// sessionStorage.removeItem("itm_in_cart");
$(document).ready(() => {
    var items = JSON.parse(sessionStorage.getItem("itm_in_cart")) || [];
    const empty_cart_div = `<div class="empty_cart">
                          <img src="/img/empty_cart.svg" alt="">
                        </div>`;
    const calc_price = items => {
        var price = items.reduce(
            (total, item) =>
                total +
                parseInt(item.qty) * parseInt(item.price.replace("Ks", "")),
            0
        );
        return price + 2500;
    };
    const total_price = calc_price(items);
    //console.log(total_price);
    console.log("DUC");
    const checkout_info = `<div class="checkout_info">
                        <h3>Checkout detail</h3>
                        <p style="width:98%;max-width:470px;margin:8px 0">Fees:2500 Ks</p>
                        <p id="total_price"style="width:98%;max-width:470px">Total:${total_price} Ks</p>
                        <h4>Select payment method</h4>
                        <div class="payments">
                          <p class="payment" id="COD">
                            <i class='bx bx-radio-circle'></i>Cash on delivery
                          </p>
                          <p class="payment" id="WavePay">
                            <i class='bx bx-radio-circle'></i>WavePay
                          </p>
                          <p class="payment" id="OK$">
                            <i class='bx bx-radio-circle'></i>OK$
                          </p>
                          <p class="payment" id="KBZPay">
                            <i class='bx bx-radio-circle'></i>KBZPay
                          </p>
                        </div>
                        <input type="text"   name="payment_contact" placeholder="Enter email or phone associated with payment">
                        <input type="text"   name="address"         placeholder="Enter delivery address">
                        <input type="button" name="submit" value="Checkout">
                      </div>`;

    if (items) {
        items.forEach((item, i) => {
            if (item) {
                var total =
                    parseInt(item.price.slice(0, -2)) * parseInt(item.qty);
                var cart_item = $(".cart")
                    .append(`<div class="cart_item" id=${i}>
                            <div class="left">
                              <img src=${item.img} alt="">
                            </div>
                            <div class="right">
                              <p>Price:
                                <span>${item.price}</span>
                              </p>
                              <p>Size:
                                <span>${item.size}</span>
                              </p>
                              <p>Qty:
                                <span>${item.qty}</span>
                              </p>
                              <p>Total:
                                <span>${total + "Ks"}</span>
                              </p>
                            </div>
                            <span><i class='bx bx-x' id=${i}></i></span>
                          </div>`);
            }
        });
    }
    if (items.length < 1) {
        $(".checkout_info").fadeOut(100);
        $(".pages").append(empty_cart_div);
    } else {
        $(".pages").append(checkout_info);
        $("input[name=address]").val($("#default_address").html());
    }
    $(".cart_item span i.bx-x").click(e => {
        const ele = e.delegateTarget;
        items.splice(parseInt(ele.id), 1);
        sessionStorage.setItem("itm_in_cart", JSON.stringify(items));
        $(".cart_item#" + ele.id).fadeOut();
        items = JSON.parse(sessionStorage.getItem("itm_in_cart")) || [];
        const total_price = calc_price(items);
        $("#total_price").html(`Total:${total_price} K`);
        if (items.length < 1) {
            $(".checkout_info").fadeOut(100);
            $(".pages").append(empty_cart_div);
        }
    });
    $(".payments p").click(e => {
        var ele = e.delegateTarget;
        id = ele.id;
        $(".payments p.active i").toggleClass(
            "bx-radio-circle  bx-radio-circle-marked"
        );
        $(".payments p.active").removeClass("active");
        $(ele).addClass("active");
        $(".payments p.active i").toggleClass(
            "bx-radio-circle  bx-radio-circle-marked"
        );
    });
    $(".payments p:first-child").click();
    $("input[type=button]").click(() => {
        const payment_contact = $("input[name=payment_contact]"),
            payment_method = $(".payments p.active"),
            address_info = $("input[name=address]"),
            items = JSON.parse(sessionStorage.getItem("itm_in_cart"));
        payment_contact.val()
            ? payment_contact.removeClass("err")
            : payment_contact.addClass("err");
        address_info.val()
            ? address_info.removeClass("err")
            : address_info.addClass("err");
        if (!$("input.err").length) {
            console.log("CLEA");
            axios
                .post("order", {
                    payment_contact: payment_contact.val(),
                    payment_method: payment_method.attr("id"),
                    address: address_info.val(),
                    items
                })
                .then(res => {
                    sessionStorage.removeItem("itm_in_cart");
                    var html = `
            <div class="success_model">
                 <i class='bx bx-check-double'></i>
                 <h2>Order recieved</h2>
                 <p>
                 Your order was been recieved and our team will deliver to you with 3 working week.
                 If you choose a online payment to pay,please send money within 2 working days or else your order will be cancelled
                 </p>
                 <span class="done">DONE</span>
            </div>
            `;
                    $(".popover")
                        .fadeOut()
                        .html(html)
                        .addClass("show");
                    $(".success_model .done").click(e => location.reload());
                })
                .catch(err => console.log(err.response.data));
        }
    });
});
