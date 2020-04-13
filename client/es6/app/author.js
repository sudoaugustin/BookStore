import $ from "jquery";
import axios from "axios";
import "../../style/author.scss";
import { renderBook, renderBooks } from "./book";
import { handleChange } from "../auth/index";
import { copy, isEmail } from "../configFunc";
import checkOutSuccess from "../../img/checkout_success.svg";
axios.defaults.baseURL = "http://localhost:8000";
const orderSuccess = `<div class="checkout-success">
                         <img src=${checkOutSuccess}>
                         <p>Thank for purchase.The book will be sent to your email as soon as author verified your payment</p>
                         <div class="btn ">
                           <input type="submit" name="submit" value="OK"/>
                         </div>
                      </div>`;
const renderPop = (html) => {
  html
    ? $(".popup-root").css("display", "flex").hide().fadeIn().html(html)
    : $(".popup-root").fadeOut().html("");
  if (html) {
    $("input,textarea").on("input", function (e) {
      handleChange($(this).attr("name"));
    });
    $(".popup-root span.active").click(() => $(".popup-root ul").fadeToggle());
    $(".popup-root ul li").click(
      ({ currentTarget: { innerHTML: html, id } }) => {
        $(".popup-root span.active").html(html).click();
        $(".bill-root fieldset").removeClass("err");
        $(".bill-root fieldset .msg").html("");
        $(".bill-root #senderId input").val(id);
      }
    );
    $(".bill-root ul li:first-child").click();
    $(".popup-root span.active").click();
    handelClose();
  }
};
const handelClose = () => $(".popup-root .bx-x").click(() => renderPop());
const avatar = `data:image/png;base64,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`;

const handelBookClick = () =>
  $(".books img").click((e) => {
    const book = window.books.find((book) => book.id == e.currentTarget.id);
    console.log(book.price);
    renderPop(renderBook({ ...book, guest: true }));
    $(".popup-root .copy-btn").click((e) => {
      copy(
        book.id,
        () => {
          $(".copy-btn i").toggleClass("bxs-copy bxs-check-circle bx-tada");
          setTimeout(
            () =>
              $(".copy-btn i").toggleClass("bxs-copy bxs-check-circle bx-tada"),
            1800
          );
        },
        null,
        $
      );
    });
    $(".popup-root .checkout-btn").click(() => {
      handelBuyBook(window.user.payments, book.price, book.id);
    });
  });

const handelBuyBook = (payments, price, bookID) => {
  let paymentDiv = "";
  const paymentName = {
    wave: "WavePay",
    kbzpay: "KBZPay",
    cbpay: "CBPay",
    cbbank: "CB",
    kbzbank: "KBZ",
  };
  for (const payment in payments) {
    paymentDiv += `<li id=${
      paymentName[payment].includes("Pay")
        ? "09" + payments[payment]
        : payments[payment]
    }>${paymentName[payment]}</li>`;
  }
  const form = ({ price }) => `<div class="bill-root"><div class="srcoll-div">
       <i class='bx bx-x'></i>
      <h2>Enter following information</h2>
      <div class="flex"><p>Send ${price} Ks to the following account.After the author verified your payment,book will be sent to your email</p></div>
          <fieldset id="customerID">
                  <label for="password">Select & Enter Account Id </label>
                  <div class="phoneField">
                      <div class="payment-method">
                        <span class="active">KBZ</span>
                        <ul>${paymentDiv}</ul>
                      </div>
                      <input autocomplete="none" type="tel" name="accId" autofocus placeholder="Account Id"/>
                  </div>
                  <label for="wave" class="msg"></label>
          </fieldset>
          <fieldset id="customerEmail">
                  <label for="password">Email to sent book</label>
                  <div class="textField jj">
                      <input autocomplete="none" type="tel" name="accId" autofocus placeholder="Account Id"/>
                  </div>
                  <label for="wave" class="msg"></label>
          </fieldset>
          <fieldset class="recieve-detail" id="senderId">
                    <label for="password">Money to be sent </label>
                    <div class="textField copy-btn">
                      <input type="text" name="password" disabled />
                      <i class='bx bxs-copy bx-sm'></i>
                    </div>
                    <label for="password" class="msg"></label>
          </fieldset>
          <div class="btn">
            <input type="submit" name="submit" value="Pay Bills" />
          </div>

  </div></div>`;
  renderPop(form({ price }));
  $(".copy-btn").click(() => {
    copy(
      $("#senderId input").val(),
      () => {
        $(".copy-btn i").toggleClass("bxs-copy bxs-check-circle bx-tada");
        setTimeout(
          () =>
            $(".copy-btn i").toggleClass("bxs-copy bxs-check-circle bx-tada"),
          1800
        );
      },
      null,
      $
    );
  });
  $(".bill-root .btn").click((e) => {
    const id = $("#customerID input"),
      email = $("#customerEmail input"),
      gateway = $(".popup-root .payment-method span.active").html(),
      error1 = !id.val()
        ? "Enter account id"
        : gateway.includes("Pay")
        ? isNaN(id.val()) || id.val().length < 8 || id.val().length > 12
          ? "Invalid phone number"
          : null
        : isNaN(id.val()) || id.val().length < 16 || id.val().length > 17
        ? "Invalid account number"
        : null,
      error2 = !email.val()
        ? "Enter email"
        : !isEmail(email.val())
        ? "Invalid Email"
        : null;
    if (error1) {
      id.parents("fieldset").addClass("err");
      id.parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${error1}`);
    }
    if (error2) {
      email.parents("fieldset").addClass("err");
      email
        .parent()
        .siblings(".msg")
        .html(`<i class='bx bxs-error-circle' ></i>${error2}`);
    }
    if (!error2 || error1) {
      axios
        .post("/order", {
          bookID,
          sendID: id.val(),
          email: email.val(),
          gateway: gateway,
        })
        .then((res) => {
          renderPop(orderSuccess);
          $(".btn").click((e) => renderPop());
        })
        .catch((err) => console.log(err.response));
    }
  });
};
$(document).ready(async (e) => {
  const authorId = location.search.replace("?authorId=", ""),
    {
      data: { user, books, orders },
    } = await axios.get(`/author/${authorId}`);
  window.user = user;
  window.books = books
    .map((book) => ({
      ...book,
      src: book.img,
      id: book._id,
      title: book.name,
      date: new Date(book.date),
    }))
    .reverse();
  window.orders = orders;
  const img = window.user.avatar || avatar;
  $(".profile img").attr("src", img);
  $(".profile h2").html(user.name);
  $(".profile span:first-child").html(
    `${orders.length}  ${orders.length > 1 ? " Orders" : " Order"}`
  );
  $(".profile span:last-child").html(
    `${books.length} ${books.length > 1 ? " Books" : " Book"}`
  );
  renderBooks({ $, books: window.books, parent: $(".books") });
  handelBookClick();
  const getAuthDetail = () => {};
});
