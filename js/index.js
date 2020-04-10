const $ = require("jquery");
const axios = require("axios");
function search(name = $('input[name="search"].mob').val()) {
    if (!name) return $("nav ul li:first-child").click();
    console.log(name);
    axios
        .post("search", {
            category: $(".filterbox.mob .category_tag p span.active").html(),
            name,
            brand: $(".filterbox.mob .brands_tag p span.active").html()
        })
        .then(res => {
            const products = res.data;
            $(".pages").html(
                `<script type="text/javascript" src="js/explore.js"></script>
                 <div class='searchResults'></div>`
            );
            products.forEach(product => {
                const item = `
                <div class="item_card" id="${product.id}">
                    <div class="top">
                        <span>${product.name}</span>
                        <i class='bx bx-info-circle'></i>
                    </div>
                    <img src="storage/products/${product.img}">
                    <div class="bottom">
                    <span class="price"></span>
                    <p>
                        <span class="likes">
                        <i class='bx bxs-heart'  id=${product.id}></i>
                        ${product.likes}
                        </span>
                    </p>
                    </div>
                 </div>`;
                $(".searchResults").append(item);
            });
        })
        .catch(err => console.log(err.response));
}
$(document).ready(() => {
    $("nav ul li").click(e => {
        $("nav ul li.active").removeClass("active");
        const ele = $(e.delegateTarget);
        ele.addClass("active");
        axios
            .get(ele[0].id)
            .then(res => {
                //console.log(res.data);
                if (ele[0].id === "cart")
                    $("nav ul li#cart.noti").removeClass("noti");
                $(".pages").html(res.data);
            })
            .catch(err => console.log(err.response));
    });
    $('input[name="search"]').on("input", e => {
        let value = e.delegateTarget.value;
        $("input[name=search]").val(value);
        // $(".results").addClass("show");
        search(value);
    });
    $('input[name="search"]').on("blur", e => {
        $(".results").removeClass("show");
    });
    $('input[name="search"]').on("blur", e => {
        $(".results").removeClass("show");
    });
    $(".nav_right>span img#avatar").on("click", e => {
        $(".acc_kit").toggleClass("show");
    });
    $(".nav_right>i.bx-bell").click(e => {
        $(".notifications").toggleClass("show");
    });
    $('input[name="search"]').val(null);
    // $(".notification .title").click(e => {
    //     const target = e.delegateTarget,
    //         id = target.id;
    //     if ($(".notification#" + id).hasClass("unread")) {
    //         $(".notification#" + id).removeClass("unread");
    //         axios.put("updateNotiStatus/" + id);
    //     }
    //     $(".notification#" + id + " .content").toggleClass("show");
    // });
    $(".acc_kit .kit p").on("click", e => {
        $(".nav_right>span img#avatar").click();
        if (e.delegateTarget.id === "logout") {
            axios.post("/logout");
            window.location.reload();
            return;
        }
        axios
            .get(e.delegateTarget.id)
            .then(res =>
                $(".popover")
                    .css("display", "flex")
                    .hide()
                    .fadeIn()
                    .html(res.data)
            )
            .catch(e => console.log(e.response));
    });
    $("nav ul li:first-child").click();
    // $(".filterbox .price_tag p span").click(e => {
    //     const ele = e.delegateTarget,
    //         id = ele.className;
    //     $(".filterbox .price_tag p span.active").removeClass("active");
    //     $(`.filterbox .price_tag p span.${id}`).addClass("active");
    //     search();
    // });
    $(".filterbox .category_tag p span").click(e => {
        const ele = e.delegateTarget,
            id = ele.className;
        $(".filterbox .category_tag p span.active").removeClass("active");
        $(`.filterbox .category_tag p span.${id}`).addClass("active");
        axios
            .get(
                "/getBrands/" +
                    $(".filterbox.mob .category_tag p span.active").html()
            )
            .then(res => {
                const brands = res.data;
                $(".filterbox .brands_tag p").html("");
                if (brands.length > 0) {
                    $(".filterbox .brands_tag p").append(
                        `<span class="b0">all</span>`
                    );
                } else
                    $(".filterbox .brands_tag p").html(
                        "<h4>No Brand Available</h4>"
                    );
                brands.forEach((brand, i) => {
                    $(".filterbox .brands_tag p").append(
                        `<span class=${"b" + (i + 1)}>${brand}</span>`
                    );
                });
                $(".filterbox .brands_tag p span").click(e => {
                    const ele = e.delegateTarget,
                        id = ele.className;
                    $(".filterbox .brands_tag p span.active").removeClass(
                        "active"
                    );
                    $(`.filterbox .brands_tag p span.${id}`).addClass("active");
                    search();
                });
                $(".filterbox.mob .brands_tag p span:first-child").click();
            })
            .catch(err => console.log(err.response));
    });
    $(".filterbox.mob .price_tag p span:last-child").click();
    $(".filterbox.mob .category_tag p span:first-child").click();
    $(".filter-btn").click(e => $(".filterbox").toggleClass("show"));
});
