import "../../style/auth.scss";
import $ from "jquery";
import { isUsername, isEmail, getToken, redirect } from "../configFunc.js";
import axios from "axios";
axios.defaults.baseURL = "http://localhost:8000";
var visibile = false;
const timerClick = (email) => {
  if (!$(".timer").hasClass("disable")) {
    $(".timer").addClass("disable");
    $(".linear-progress-material").addClass("show");
    axios
      .post("/auth/verify/reqCode", { email })
      .then(() => {
        $(".linear-progress-material").removeClass("show");
        var start = 60;
        $(".timer").html(start);
        const timer = setInterval(() => {
          start <= 0
            ? $(".timer")
                .removeClass("disable")
                .html("<i class='bx bx-revision bx-sm'></i>") &&
              clearInterval(timer)
            : $(".timer").html(start) && --start;
        }, 1000);
      })
      .catch((err) => {
        $(".linear-progress-material").removeClass("show");
        console.log(err.response);
      });
  }
};
const authCode = `<form>
                    <p>Enter the code that we sent to your email</p>
                    <fieldset>
                      <label for="code">Code</label>
                      <div class="textField">
                        <input
                          autocomplete="none"
                          type="text"
                          name="code"
                          autofocus
                          placeholder="e.g.452723"
                        />
                        <div class="timer">
                          <i class='bx bx-revision bx-sm'></i>
                        </div>
                      </div>
                      <label for="code" class="msg"></label>
                    </fieldset>
                    <div class="btn">
                      <input type="submit" name="submit" value="Verify" />
                    </div>
                    <div class="btn outlined">
                      <a href="login.html">Login</a>
                    </div>
                 </form>`;
const passCode = `<form>
                    <p>Enter new password</p>
                    <fieldset>
                      <label for="password">Enter Password </label>
                      <div class="passwordField">
                        <input type="password" name="password" placeholder="Enter your password" />
                        <svg for="password" class="pwdVisibilityIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24">
                          <path id="path1" d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
                          <path id="path2"
                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                        </svg>
                      </div>
                      <label for="password" class="msg"></label>
                    </fieldset>
                    <fieldset>
                      <label for="confirm">Confirm Password </label>
                      <div class="passwordField">
                        <input type="password" name="confirm" placeholder="Enter your password" />
                        <svg for="confirm" class="pwdVisibilityIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                          viewBox="0 0 24 24">
                          <path id="path1" d="M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z" fill="none" />
                          <path id="path2"
                            d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                        </svg>
                      </div>
                      <label for="confirm" class="msg"></label>
                    </fieldset>
                    <div class="btn">
                      <input type="submit" name="submit" value="Change password" />
                    </div>
                  </form>`;
const newPassForm = (data) => {
  $("form").replaceWith(passCode);
  $(".passwordField input").on("input", function (e) {
    handleChange($(this).attr("name"));
  });
  $(".pwdVisibilityIcon").click(function (e) {
    tglPasswordVisibility($(this).attr("for"));
  });
  $("form").on("submit", (e) => {
    e.preventDefault();
    handleSubmit(e, {
      url: "/auth/changePass/",
      _data: { email: data.email },
      callback: () => (window.location.href = "login.html"),
    });
  });
};
const redirectLogged = () => {
  if (getToken()) redirect("app.html");
};
console.log(getToken());

const verifyForm = (data) => {
  $("form").replaceWith(authCode);
  $(".textField input").on("input", function (e) {
    handleChange($(this).attr("name"));
  });
  $(".timer").click((e) => {
    timerClick(data.email);
  });

  $("form").on("submit", (e) => {
    e.preventDefault();
    handleSubmit(e, {
      url: "/auth/verify/",
      _data: { email: data.email },
      callback: () => (window.location.href = "login.html"),
    });
  });
};
const tglPasswordVisibility = (name) => {
  visibile = !visibile;
  let path1 = $(`[for="${name}"]   #path1`),
    path2 = $(`[for="${name}"]   #path2`);
  if (visibile) {
    path1.attr("d", "M0 0h24v24H0z");
    path2.attr(
      "d",
      "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
    );
  } else {
    path1.attr("d", "M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z");
    path2.attr(
      "d",
      "M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
    );
  }
  $(`input[name="${name}"]`).attr("type", visibile ? "text" : "password");
};

const handleChange = (name) => {
  const input = $(`input[name=${name}]`);
  input.parents("fieldset").removeClass("err");
  input.parent().siblings(".msg").html("");
};
const handleSubmit = (e, { url, callback, _data }) => {
  const password = $("input[name=password]"),
    confirm = $("input[name=confirm]"),
    code = $("input[name=code]"),
    email = $("input[name=email]"),
    user = $("input[name=user]"),
    null_error = {
      email: "Enter email",
      password: "Enter password",
      confirm: "Confirm password",
      user: "Enter username",
      code: "Enter authentication code",
    },
    invalid = {
      email: "Invalid email",
      user: {
        length: "Username's minium length is 5",
        char: "Username can contain only letter and number",
      },
      password: "Password's minimum length is 8",
      confirm: "Passwords do not match",
      code: "Code's minium length is 6",
    };
  e.preventDefault();
  $("input").each((index, { value, name }) => {
    if (!value && name != "remember" && name != "submit") {
      const input = $(`input[name=${name}]`);
      input.parents("fieldset").addClass("err");
      input
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${null_error[name]}`);
    }
  });
  if (user.length && user.val()) {
    const username = user.val();
    if (username.length < 5) {
      user.parents("fieldset").addClass("err");
      user
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${invalid.user.length}`);
    } else if (!isUsername(username)) {
      user.parents("fieldset").addClass("err");
      user
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${invalid.user.char}`);
    }
  }
  if (email.length && email.val()) {
    if (!isEmail(email.val())) {
      email.parents("fieldset").addClass("err");
      email
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${invalid.email}`);
    }
  }
  if (password.length && password.val() && confirm.length) {
    if (password.val().length < 8) {
      password.parents("fieldset").addClass("err");
      password
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${invalid.password}`);
    } else if (password.val() != confirm.val()) {
      confirm.parents("fieldset").addClass("err");
      confirm
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${invalid.confirm}`);
    }
  }
  if (code.length && code.val()) {
    if (code.val().length < 6 || isNaN(code.val())) {
      code.parents("fieldset").addClass("err");
      code
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${invalid.code}`);
    }
  }
  if (!$("fieldset.err").length) {
    const data = { ..._data };
    $(".linear-progress-material").addClass("show");
    $("input")
      .toArray()
      .forEach(
        ({ name, value, checked, type }) =>
          (data[name] = type === "checkbox" ? checked : value)
      );
    axios
      .post(url, data)
      .then((res) => {
        $(".linear-progress-material.show").removeClass("show");
        callback({ ...data, ...res.data });
      })
      .catch(({ response: { status, statusText } }) => {
        $(".linear-progress-material.show").removeClass("show");
        var input, msg;
        switch (status) {
          case 401:
            input = $("input[name=password]").length
              ? $("input[name=password]")
              : $("input[name=code]");
            msg = $("input[name=password]").length
              ? "Wrong password"
              : "Wrong code";
            break;
          case 404:
            input = $("input[name=email]");
            msg = "Email not found";
            break;
          case 403:
            verifyForm({ email: email.val() });
            return;
          case 409:
            input = $("input[name=email]").length
              ? $("input[name=email]")
              : $("input[name=password]");
            msg = $("input[name=email]").length
              ? "Email already exists"
              : "New Password cann't be old password";
            break;
          default:
            break;
        }
        input.parents("fieldset").addClass("err");
        input
          .parent()
          .siblings(".msg")
          .html(`<i class='bx bxs-error-circle' ></i>${msg}`);
      });
  }
};
export {
  tglPasswordVisibility,
  handleChange,
  handleSubmit,
  verifyForm,
  timerClick,
  newPassForm,
  redirectLogged,
};
