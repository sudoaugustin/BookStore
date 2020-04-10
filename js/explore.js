const $ = require("jquery");
const axios = require("axios");
$(document).ready(() => {
    $(".item_card").click(e => {
        const ele = e.delegateTarget,
            id = ele.id;
        axios
            .get("product/" + ele.id)
            .then(res => {
                $(".popover")
                    .css("display", "flex")
                    .hide()
                    .fadeIn()
                    .html(res.data);
            })
            .catch(err => console.log(err.response));
    });
});
