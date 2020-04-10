const $ = require("jquery");
const axios = require("axios");

$(document).ready(() => {
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
    $("input[name=submit]").click(e => {
        var payment = $(".payment.active").attr("id"),
            address = $("input[name=address]"),
            amount = $("input[name=amount]");
        max = parseInt($("#max").attr("for"));
        !address.val() ? address.addClass("err") : address.removeClass("err");
        if (!amount.val()) amount.addClass("err");
        else if (isNaN(amount.val())) amount.addClass("err");
        else if (amount.val() < 50000) {
            amount.addClass("err");
            $(".errMsg")
                .html("Minium withdraw amount is 50000Ks")
                .addClass("visible");
        } else if (amount.val() > max) {
            $(".errMsg")
                .html(`Maximum withdraw amount is ${max}Ks`)
                .addClass("visible");
        } else {
            amount.removeClass("err");
            $(".errMsg").removeClass("visible");
        }
        if (!$(".exchange .err").length) {
            var location_arr = window.location.href.split("/"),
                s_id = parseInt(location_arr[location_arr.length - 1]);
            axios
                .post("/exchange", {
                    s_id,
                    payment,
                    address: address.val(),
                    amount: parseInt(amount.val())
                })
                .then(res => {
                    var msg = `
                <i class='bx bx-check-double'></i>
                <h3 class="successMsg">Success!</h3>
                <h5>Request has been sent to server.Money will be transfered within 3 working weeks.</h5>
                <span class="done">OK</span>
                `;
                    $(".exchange").html(msg);
                    $(".done").click(() => location.reload());
                })
                .catch(err => console.log(err.response));
        }
    });
});
