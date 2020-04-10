const $ = require("jquery");
const auth = require("../auth");
const axios = require("axios");
$(document).ready(e => {
    var imgChanged = false;
    $(".setting .bx-camera").click(e => {
        $("#img_picker").click();
    });
    $(".setting #img_picker").change(e => {
        const toBase64 = file =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                imgChanged = true;
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
    $(".setting .form_btn_gp #save").click(e => {
        var name = $("input[name=name]"),
            desc = $("textarea[name=desc]"),
            addr = $("input[name=address]"),
            imgFile = document.querySelector("#img_picker").files[0];
        if (!name.val()) {
            name.parent().addClass("err");
            $(`label[for=name].msg`).html("Enter shop name");
        } else {
            name.parent().removeClass("err");
            $(`label[for=name].msg`).html("");
        }
        if (!addr.val()) {
            addr.parent().addClass("err");
            $(`label[for=address].msg`).html("Enter shop address");
        } else {
            addr.parent().removeClass("err");
            $(`label[for=address].msg`).html("");
        }
        if (!$("input.err").length) {
            let formData = new FormData(),
                location_arr = window.location.href.split("/"),
                s_id = parseInt(location_arr[location_arr.length - 1]);
            formData.append("name", name.val());
            formData.append("desc", desc.val());
            formData.append("address", addr.val());
            formData.append("page", "updateShop");
            formData.append("s_id", s_id);
            formData.append("img", imgFile);
            axios
                .post("/management", formData)
                .then(res => location.reload())
                .catch(err => console.log(err.response));
        }
    });
    $(".req_btn").click(e => {
        var form = new FormData();
        form.append("s_id", parseInt(e.delegateTarget.id));
        axios
            .post("/requestupgrade", form)
            .then(res => {
                var msg = `
                <div class="exchange">
                <i class='bx bx-check-double'></i>
                <h3 class="successMsg">Requested!</h3>
                <h4>Request has been sent to server.Out team will review your request & contact you.</h4>
                <span class="done">OK</span>
                <div>
              `;
                $(".popover").html(msg);
                $(".done").click(() => $(".popover").fadeOut());
            })
            .catch(err => console.log(err));
    });
});
