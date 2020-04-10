const $ = require("jquery");
const axios = require("axios");
$(document).ready(() => {
    $(".custom-select .option span").click(e => {
        const ele = e.delegateTarget,
            value = ele.innerHTML;
        $("input[name=category]").val(value);
        $(".custom-select .active").html(
            value + "<i class='bx bxs-down-arrow'></i>"
        );
        $(".custom-select .option").fadeOut();
    });
    $(".custom-select .active").click(e => {
        $(".custom-select .option")
            .css("display", "flex")
            .hide()
            .fadeIn();
    });
    $(".custom-select .option span:first-child").click();
    $(".spec .bxs-plus-square").click(e => {
        $(".spec").append(`
        <input type="text" name="spec" placeholder="Specification">
        `);
    });
    $(".size-btn").click(e => {
        var id = $(".size-root").length + 1 || 1,
            element = `<div id=${id} class="size-root">
            <input type="text" name="size"  placeholder="Enter size">
            <input type="text" name="color" placeholder="Enter color">
            <input type="text" name="qty"   placeholder="Enter quantity">
            <input type="text" name="price"   placeholder="Enter price in Ks">
            <div class="color-img" id=${id}>
               <h5>Min-3 photos</h5>
               <input class="file" type="file" id=${id} style="display: none" multiple>
               <p class="upload-btn" id=${id}>Upload Image</p>
               <div class="imgs" id=${id}>
               </div>
            </div>      
           </div>`;
        $(".sizes").append(element);
        $(".upload-btn").click(e => {
            var id = e.delegateTarget.id;
            $("#" + id + ".file").click();
            console.log("CALLED");
            return false;
        });
        $(".file").change(e => {
            var id = e.delegateTarget.id,
                curImgs = $("#" + id + ".size-root .imgs img").length || 0;
            $("#" + id + ".size-root .imgs").html("");
            const toBase64 = file =>
                new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });
            async function Main(file) {
                const img = await toBase64(file);
                $("#" + id + ".size-root .imgs").append(`
                <img src=${img}>
                `);
            }
            const files = e.delegateTarget.files;
            for (let i = 0; i < 5; i++) {
                Main(files[i]);
            }
        });
    });
    $(".size-btn").click();
    $(".submit .cancel").click(() => {
        $(".kit i:first-child").click();
    });
    $(".submit .create").click(() => {
        var name = $("input[name=name]"),
            b_name = $("input[name=b_name]"),
            category = $("input[name=category]"),
            desc = $("textarea"),
            specs = $("input[name=spec]"),
            sizes = $("input[name=size]"),
            colors = $("input[name=color]"),
            qtys = $("input[name=qty]"),
            prices = $("input[name=price]"),
            imgs = $(".imgs"),
            imgFiles = $(".file");
        !name.val() ? name.addClass("err") : name.removeClass("err");
        !b_name.val() ? b_name.addClass("err") : b_name.removeClass("err");
        !category.val()
            ? category.addClass("err")
            : category.removeClass("err");
        !desc.val() ? desc.addClass("err") : desc.removeClass("err");
        // specs.each((i,obj)=>{
        //     !$(obj).val()?$(obj).addClass("err"):$(obj).removeClass("err");
        // });
        sizes.each((i, obj) => {
            !$(obj).val() ? $(obj).addClass("err") : $(obj).removeClass("err");
        });
        qtys.each((i, obj) => {
            !$(obj).val() ? $(obj).addClass("err") : $(obj).removeClass("err");
        });
        prices.each((i, obj) => {
            !$(obj).val() || isNaN($(obj).val())
                ? $(obj).addClass("err")
                : $(obj).removeClass("err");
        });
        colors.each((i, obj) => {
            !$(obj).val() ? $(obj).addClass("err") : $(obj).removeClass("err");
        });
        imgs.each((i, obj) => {
            var id = obj.id;
            $(obj).children().length < 3
                ? $("#" + id + ".upload-btn").addClass("err")
                : $("#" + id + ".upload-btn").removeClass("err");
        });

        if (!$(".upload--root .err").length) {
            var specification = [],
                location_arr = window.location.href.split("/"),
                s_id = parseInt(location_arr[location_arr.length - 1]),
                speciString = "",
                formData = new FormData();
            for (let i = 0; i < sizes.length; i++) {
                specification[i] = {
                    size: $(sizes[i]).val(),
                    color: $(colors[i]).val(),
                    qty: $(qtys[i]).val(),
                    price: $(prices[i]).val(),
                    imgLength: imgFiles[i].files.length
                };
                for (let j = 0; j < imgFiles[i].files.length; j++) {
                    formData.append(
                        $(sizes[i]).val() + "" + $(colors[i]).val() + "" + j,
                        imgFiles[i].files[j]
                    );
                }
            }
            specs.each((i, obj) => {
                if (i == 0) speciString += $(obj).val();
                else speciString += "," + $(obj).val();
            });
            formData.append("name", name.val());
            formData.append("b_name", b_name.val().toLowerCase());
            formData.append("category", category.val());
            formData.append("s_id", s_id);
            formData.append("desc", desc.val());
            formData.append("spec", speciString);
            formData.append("specification", JSON.stringify(specification));
            axios
                .post("/product", formData)
                .then(res => {
                    console.log(res.data);
                    $(".submit .cancel").click();
                })
                .catch(err => {
                    console.log(err.response);
                });
        }
    });
});
