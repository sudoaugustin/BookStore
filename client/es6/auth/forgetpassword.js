import $ from "jquery";
import { handleChange, handleSubmit, timerClick, newPassForm } from "./auth.js";
import { isEmail } from "../configFunc.js";
$(document).ready(function () {
  $(".textField input,.passwordField input").on("input", function (e) {
    handleChange($(this).attr("name"));
  });
  $("form").on("submit", (e) =>
    handleSubmit(e, {
      url: "auth/verify/",
      callback: newPassForm,
    })
  );
  $(".timer").click((e) => {
    const email = $("input[name=email]");
    if (!email.val()) {
      email.parents("fieldset").addClass("err");
      email
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>Enter email`);
    } else if (!isEmail(email.val())) {
      email.parents("fieldset").addClass("err");
      email
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>Invalid email`);
    } else timerClick(email.val());
  });
});
