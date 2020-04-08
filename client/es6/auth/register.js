import $ from "jquery";
import {
  tglPasswordVisibility,
  handleChange,
  handleSubmit,
  verifyForm,
  redirectLogged,
} from "./index.js";
redirectLogged();
$(document).ready(function () {
  console.log("Readt");
  $(".pwdVisibilityIcon").click(function (e) {
    tglPasswordVisibility($(this).attr("for"));
  });
  $(".textField input,.passwordField input").on("input", function (e) {
    handleChange($(this).attr("name"));
  });
  $("form").on("submit", (e) =>
    handleSubmit(e, {
      url: "/auth/register/",
      callback: verifyForm,
    })
  );
});
