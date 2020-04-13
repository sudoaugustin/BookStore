import { isUsername, copy } from "../configFunc";
import requestedSVG from "../../img/paybill.svg";
const Profile = ({ name, avatar, email }) => `
                <div class="profile-setting-root">
                    <input type="file" style="display: none;" name="src">
                    <i class='bx bx-x'></i>
                    <img title="Click to upload avatar " 
                    src=${
                      avatar || "../img/avatar.svg"
                    } id="img-picker" alt=null>
                    <fieldset>
                        <div class="textField">
                            <input autocomplete="none" type="text" name="name" autofocus placeholder="Enter username" value=${name} />
                        </div>
                        <label for="name" class="msg"></label>
                    </fieldset>
                    <fieldset>
                        <div class="textField">
                            <input autocomplete="none" type="text" name="email" autofocus placeholder="Enter email" value=${email} disabled/>
                        </div>
                        <label for="name" class="msg"></label>
                    </fieldset>
                    <div class="btn">
                        <input type="submit" name="submit" value="Save" />
                    </div>
                 </div>`;
const updateProfile = ({ $, axios, renderPop }) => {
  const src = $("input[type=file]").prop("files")[0],
    name = $("input[name=name]"),
    error = {};
  if (!name.val()) error.name = "Enter username";
  else if (!isUsername(name.val())) error.name = "Invalid username";
  if (error.name) {
    name.parents("fieldset").addClass("err");
    name
      .parent()
      .siblings(".msg")
      .html(`<i class='bx bxs-error-circle' ></i>${error.name}`);
  }
  if (!$("fieldset.err").length) {
    const avatar = $("#img-picker").attr("src");
    $(".linear-progress-material").addClass("show");
    axios
      .put("/user/", {
        name: name.val(),
        avatar,
      })
      .then((res) => {
        renderPop();
        if (window.user.avatar !== avatar) {
          window.user.avatar = avatar;
          $("header .profile-btn img").attr("src", avatar);
        }
        if (window.user.name !== name.val()) {
          window.user.name = name.val();
          $("header .profile-btn span").html(name.val());
        }

        $(".linear-progress-material.show").removeClass("show");
      })
      .catch((err) => {
        $(".linear-progress-material.show").removeClass("show");
        console.log(err);
      });
  }
};

const Payments = ({ wave: wavepay, kbzpay, kbzbank, cbbank, cbpay }) =>
  `<div class="account-setting-root">
     <i class='bx bx-x'></i>
     
     <div class="srcoll-div">
            <h2>Enter the acc id to accept money</h2>
            <fieldset>
              <label for="password">WavePay </label>
                <div class="phoneField dense">
                    <i>09</i>
                    <input autocomplete="none" type="tel" name="wave" autofocus placeholder="Enter WavePay ph no" value=${
                      wavepay || ""
                    }>
                </div>
                <label for="wave" class="msg"></label>
            </fieldset>
            <fieldset>
            <label for="password">KBZPay </label>
              <div class="phoneField dense">
                  <i>09</i>
                  <input autocomplete="none" type="tel" name="kbzpay" autofocus placeholder="Enter KBZPay ph no" value=${
                    kbzpay || ""
                  }>
              </div>
              <label for="kbzpay" class="msg"></label>
            </fieldset>
            <fieldset>
            <label for="password">CBpay </label>
              <div class="phoneField dense">
                  <i>09</i>
                  <input autocomplete="none" type="tel" name="cbpay" autofocus placeholder="Enter CBpay ph no" value=${
                    cbpay || ""
                  }>
              </div>
              <label for="cbpay" class="msg"></label>
            </fieldset>
            <fieldset>
            <label for="password">KBZ Acc No</label>
              <div class="textField dense">
                  <input autocomplete="none" type="tel" name="kbzbank" autofocus placeholder="Enter KBZ bank acc no" value=${
                    kbzbank || ""
                  }>
              </div>
              <label for="kbzbank" class="msg"></label>
            </fieldset>
            <fieldset>
            <label for="password">CB Acc No </label>
              <div class="textField dense">
                  <input autocomplete="none" type="tel" name="cbbank" autofocus placeholder="Enter CB bank acc no" value=${
                    cbbank || ""
                  }>
              </div>
              <label for="cbbank" class="msg"></label>
            </fieldset>
            <div class="btn dense">
              <input type="submit" name="submit" value="Save" />
            </div>
     </div>
  </div>`;
const updatePayments = ({ $, axios, renderPop }) => {
  const error = {
      bank: "Invalid account no",
      pay: "Invalid phone no",
    },
    payments = {};
  $("input[type=tel]").each((index, { value, name }) => {
    if (value) {
      const _error =
        name.includes("bank") && (value.length < 16 || value.length > 17)
          ? error.bank
          : name.includes("pay") && (value.length < 8 || value.length > 10)
          ? error.pay
          : null;
      if (_error) {
        const input = $(`input[name=${name}]`);
        input.parents("fieldset").addClass("err");
        input
          .parent()
          .siblings(".msg")
          .html(`<i class='bx bxs-error-circle' ></i>${_error}`);
      } else payments[name] = value;
    }
  });
  if (!$("fieldset.err").length) {
    $(".linear-progress-material").addClass("show");
    axios
      .post("user/payment", payments)
      .then((res) => {
        window.user.payments = payments;
        renderPop();
        $(".linear-progress-material.show").removeClass("show");
      })
      .catch((err) => {
        $(".linear-progress-material.show").removeClass("show");
      });
  }
};

const Bills = ({ amount }) =>
  `<div class="bill-root">
      <i class='bx bx-x'></i>
      <h2>Fees to pay for book sales</h2>
      <div class="flex"><h1>${amount}</h1><h3>Ks</h3></div>
          <fieldset>
                  <label for="password">Select & Enter Account Id </label>
                  <div class="phoneField">
                      <div class="payment-method">
                        <span class="active">KBZ</span>
                        <ul>
                            <li>CB</li>
                            <li>KBZ</li>
                            <li>KBZPay</li>
                            <li>WavePay</li>
                            <li>CBPay</li>
                        </ul>
                      </div>
                      <input autocomplete="none" type="tel" name="accId" autofocus placeholder="Account Id"/>
                  </div>
                  <label for="wave" class="msg"></label>
          </fieldset>
          <div class="btn">
            <input type="submit" name="submit" value="Pay Bills" />
          </div>
   </div>`;
const PayBills = ({ $, axios, renderPop }) => {
  const id = $("input[type=tel]"),
    gateway = $(".popup-root .payment-method span.active").html(),
    error = !id.val()
      ? "Enter account id"
      : gateway.includes("Pay")
      ? isNaN(id.val()) || id.val().length < 8 || id.val().length > 12
        ? "Invalid phone number"
        : null
      : isNaN(id.val()) || id.val().length < 16 || id.val().length > 17
      ? "Invalid account number"
      : null;
  if (error) {
    id.parents("fieldset").addClass("err");
    id.parent()
      .siblings(".msg")
      .html(`<i class='bx bxs-error-circle' ></i>${error}`);
  } else {
    $(".linear-progress-material").addClass("show");
    axios
      .post("user/paybill", {
        accId: id.val(),
        gateway,
      })
      .then((res) => {
        console.log(res.data);
        Requested({ accountId: res.data, renderPop, $ });
        $(".linear-progress-material.show").removeClass("show");
      })
      .catch((err) => {
        console.log(err.response);
        $(".linear-progress-material.show").removeClass("show");
      });
  }
};
const Requested = ({ accountId, renderPop, $ }) => {
  const div = `<div class="requested">
                  <h1>Requested</h1>
                  <img src=${requestedSVG}>
                  <p>Your request has been sent to server.After we verified your payment, the bills  will be modified.Please send money to the following account within two days or your request will be rejected </p>
                  <span class="copy-btn">${accountId}<i class='bx bxs-copy bx-sm'></i></span>
                  <div class="btn">
                          <input type="submit" name="submit" value="OK" />
                  </div>
               </div>`;
  renderPop(div);
  $(".popup-root .copy-btn").click(() =>
    copy(
      accountId,
      () => {
        $(" .copy-btn i").toggleClass("bxs-copy bxs-check-circle bx-tada");
        setTimeout(
          () =>
            $(" .copy-btn i").toggleClass("bxs-copy bxs-check-circle bx-tada"),
          1800
        );
      },
      null,
      $
    )
  );
  $(".popup-root .btn").click(() => renderPop());
};
export {
  updateProfile,
  Profile,
  Payments,
  updatePayments,
  Bills,
  PayBills,
  Requested,
};
