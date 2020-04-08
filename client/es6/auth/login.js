import $ from "jquery";
import {
  tglPasswordVisibility,
  handleChange,
  handleSubmit,
  redirectLogged,
} from "./auth.js";
import { getOS, setToken } from "../configFunc.js";
redirectLogged();
$(document).ready(function () {
  $(".pwdVisibilityIcon").click(function (e) {
    tglPasswordVisibility($(this).attr("for"));
  });
  $(".textField input,.passwordField input").on("input", function (e) {
    handleChange($(this).attr("name"));
  });
  $("form").on("submit", (e) =>
    handleSubmit(e, {
      url: "/auth/login/",
      _data: {
        device: getOS(),
      },
      callback: ({ remember: temp, token }) => setToken({ token, temp }),
    })
  );
});
