const $ = require("jquery");
const axios = require("axios");
$(document).ready(e => {
    $(".setting .bx-x").click(e => {
        $(".popover").fadeOut();
    });
    $(".setting .bx-camera").click(e => {
        $("#img_picker").click();
    });
    $(".setting #img_picker").change(e => {
        const toBase64 = file =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        async function Main() {
            const file = e.delegateTarget.files[0];
            const img = await toBase64(file);
            $(".setting #profile").attr("src", img);
        }
        Main();
    });
    $("#save_userinfo").click(e => {
        var name = $("input[name=name]"),
            addr = $("input[name=address]"),
            phone = $("input[name=phone]"),
            imgFile = document.querySelector("#img_picker").files[0];
        if (!name.val()) {
            name.parent().addClass("err");
            $(`label[for=name].msg`).html("Enter username");
        } else {
            name.parent().removeClass("err");
            $(`label[for=name].msg`).html("");
        }
        console.log(phone.val().length);
        if (phone.val().length > 0) {
            var tel = phone.val();
            if (tel.length > 11 || tel.length < 8 || isNaN(tel)) {
                phone.parent().addClass("err");
                $(`label[for=phone].msg`).html("Enter valid phone number");
            } else if (tel[0] !== "0" || tel[1] !== "9") {
                phone.parent().addClass("err");
                $(`label[for=phone].msg`).html(
                    "Enter phone number only start with 09"
                );
            } else {
                phone.parent().removeClass("err");
                $(`label[for=phone].msg`).html("");
            }
        } else {
            phone.parent().removeClass("err");
            $(`label[for=phone].msg`).html("");
        }
        if (!$(".textField.err").length) {
            let formData = new FormData(),
                location_arr = window.location.href.split("/"),
                s_id = parseInt(location_arr[location_arr.length - 1]);
            formData.append("name", name.val());
            formData.append("address", addr.val());
            formData.append("phone", phone.val());
            formData.append("img", imgFile);
            axios
                .post("/updateUser", formData)
                .then(res => location.reload())
                .catch(err => console.log(err.response));
        }
    });
});
