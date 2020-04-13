import $ from "jquery";
import axios from "axios";
import { Home, renderCharts } from "./home";
import {
  Orders,
  renderOrder,
  renderOrders,
  EmptyOrder,
  handelArchive,
} from "./order";
import {
  Books,
  renderBooks,
  renderBook,
  NewBook,
  handelAddBook,
  EmptyShelf,
} from "./book";
import {
  updateProfile,
  Profile,
  Payments,
  updatePayments,
  Bills,
  PayBills,
} from "./setting";

import "../../style/app.scss";
import notFound from "../../img/not_found.svg";
import { getToken, copy, redirect, rmvToken } from "../configFunc";
axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.headers.common["x-auth-token"] = getToken();
const updateOrdersQty = () => {
  const length = window.orders.filter(({ status }) => status === "pending")
    .length;
  length ? $(".count").html(length) : $(".count").fadeOut();
  renderPop();
};
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const avatar = `data:image/png;base64,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`;
const renderApp = (html) => $(".app-root main").html(html);
const handelClose = () => $(".popup-root .bx-x").click(() => renderPop());
const renderPop = (html) => {
  html
    ? $(".popup-root").css("display", "flex").hide().fadeIn().html(html)
    : $(".popup-root").fadeOut().html("");
  if (html) {
    $("input,textarea").on("input", function (e) {
      handleChange($(this).attr("name"));
    });
    $(".popup-root span.active").click(() => $(".popup-root ul").fadeToggle());
    $(".popup-root ul li").click(({ currentTarget: { innerHTML: html } }) => {
      $(".popup-root span.active").html(html).click();
      $(".bill-root fieldset").removeClass("err");
      $(".bill-root fieldset .msg").html("");
    });
    handelClose();
  }
};
const handelBookClick = () =>
  $(".book-root .books img,.bookshelf img").click((e) => {
    const book = window.books.find((book) => book.id == e.currentTarget.id);
    renderPop(renderBook(book));
    $(".popup-root .copy-btn").click((e) => {
      copy(
        book._id,
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
  });
const handelSignOut = () => {
  $(".linear-progress-material").addClass("show");
  axios
    .post("user/signout")
    .then((res) => {
      rmvToken();
      redirect("login.html");
    })
    .catch((err) => console.log(err.response));
};
const handelImgUpload = () => {
  $("input[name=src]").change((e) => {
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    async function Main() {
      const file = e.delegateTarget.files[0];
      const img = await toBase64(file);
      $(".popup-root #img-picker")
        .removeClass("blank")
        .addClass("mobile")
        .attr("src", img);
    }
    Main();
  });
  $(".popup-root #img-picker").click(() => {
    $("input[name=src]").click();
  });
};
const handelBookUpload = () => {
  $("input[name=file]").change((e) => {
    const name = e.delegateTarget.files[0].name;
    $(".popup-root #file-picker").html(name).removeClass("err");
  });
  $(".popup-root #file-picker").click(() => {
    $("input[name=file]").click();
  });
};

const handleChange = (name) => {
  const input =
    name !== "desc" ? $(`input[name=${name}]`) : $(`textarea[name=${name}]`);
  input.parents("fieldset").removeClass("err");
  input.parent().siblings(".msg").html("");
};

const render = ({ i }) => {
  const { user, books, orders } = window;
  switch (i) {
    case 1:
    case 3:
      const status = i === 1 ? "pending" : "archive";
      var _orders = orders.filter((order) => order.status === status);
      _orders = _orders.map((order) => {
        const { img, name, category, price } = books.find(
          (book) => book.id === order.bookid
        );
        return {
          ...order,
          img,
          name,
          category,
          price,
          id: order._id,
          date: new Date(order.date),
        };
      });
      if (!_orders.length) return renderApp(EmptyOrder);
      renderApp(Orders({ status: i === 1 ? "pending" : "archive" }));
      renderOrders({ $, orders: _orders });
      $(".tabel-root table tr").click((e) => {
        const order = _orders.find((order) => order.id === e.currentTarget.id);
        const className = i === 1 ? "" : "archive-order-detail-root";
        order.className = className;
        if (order) renderPop(renderOrder(order));
        handelArchive({ $, axios, updateOrdersQty });
      });
      handelArchive({ $, axios, updateOrdersQty });
      break;
    case 2:
      if (!books.length) return renderApp(EmptyShelf);
      renderApp(Books);
      renderBooks({ $, books, parent: ".book-root .books" });
      handelBookClick();
      $(".searchField input").on("input", ({ currentTarget: { value } }) => {
        const _books = value
          ? books.filter((book) =>
              book.title.toLowerCase().includes(value.toLowerCase())
            )
          : books;
        if (!_books.length)
          return $(".book-root .books").html(
            `<img class="img_404"src=${notFound}>`
          );

        $(".book-root .books").html("");
        renderBooks({ $, books: _books, parent: ".book-root .books" });
        handelBookClick();
      });
      break;
    case 0:
    default:
      // if (!window.books.length) return;
      const data = {
        sales: [],
        orders: [],
      };
      orders.forEach(({ date, bookid }) => {
        date = new Date(date);
        const { price } = books.find((book) => book._id === bookid),
          i = date.getMonth(),
          month = months[i];
        const index = data.sales.findIndex((sales) => sales.x === month);
        if (index < 0) {
          data.orders.push({ x: month, y: 1 });
          data.sales.push({ x: month, y: price });
        } else {
          data.sales[index].y += price;
          data.orders[index].y++;
        }
      });
      console.log(data);
      var sale = { amount: 0, up: 0, net: 0 },
        order = { amount: 0, up: 0, net: 0 };
      data.sales.reverse();
      data.orders.reverse();
      if (data.sales.length || data.orders.length) {
        const date = new Date(),
          cur_x = months[date.getMonth()],
          pre_x = months[date.getMonth() - 1];
        const cur = {
            sale: data.sales.find(({ x }) => x === cur_x).y,
            order: data.orders.find(({ x }) => x === cur_x).y,
          },
          pre = {
            sale: data.sales.find(({ x }) => x === pre_x).y,
            order: data.orders.find(({ x }) => x === pre_x).y,
          };
        sale = {
          amount: cur.sale,
          up: cur.sale > pre.sale,
          net: cur.sale > pre.sale ? cur.sale / pre.sale : pre.sale / cur.sale,
        };
        order = {
          amount: cur.order,
          up: cur.order > pre.order,
          net:
            cur.order > pre.order
              ? cur.order / pre.order
              : pre.order / cur.order,
        };
      }
      //  else {
      //   const sale = { amount: 0, up: 0, net: 0 },
      //     order = { amount: 0, up: 0, net: 0 };
      // }
      renderApp(Home({ sale, order }));
      const _books = books.slice(0, 10);
      renderBooks({ $, books: _books, parent: ".bookshelf" });
      renderCharts(data);
      handelBookClick();
  }
  $(".linear-progress-material.show").removeClass("show");
};

$(document).ready(async () => {
  $(".linear-progress-material").addClass("show");
  const {
    data: { user: _user, books: _books, orders: _orders },
  } = await axios.get("/user/");
  window.user = _user;
  const img = window.user.avatar || avatar;
  window.books = _books
    .map((book) => ({
      ...book,
      src: book.img,
      id: book._id,
      title: book.name,
      date: new Date(book.date),
    }))
    .reverse();
  window.orders = _orders;
  updateOrdersQty();
  $(".linear-progress-material.show").removeClass("show");
  $(".profile-btn img").attr("src", img);
  $(".profile-btn span").html(window.user.name);
  $(".noti-btn").click((e) => {
    $(".noti-btn").removeClass("new");
    $(".profile-root").fadeOut();
    $(".noti-root").fadeToggle();
  });

  $(".profile-btn").click((e) => {
    $(".noti-root").fadeOut();
    $(".profile-root").fadeToggle();
  });
  $("nav ul li").click(function (e) {
    const index = $("nav ul li").index(this);
    $(".noti-root").fadeOut();
    $("nav ul li.active").removeClass("active");
    $(this).addClass("active");
    $(".active-bar").animate(
      {
        top: `${index * 45 + 8}px`,
      },
      500
    );
    render({ i: index });
  });

  $(".app-root .profile-root p").click(({ currentTarget: { id } }) => {
    const user = window.user;
    switch (id) {
      case "profile":
        renderPop(Profile(user));
        handelImgUpload();
        $(".popup-root .btn").click(() =>
          updateProfile({ $, axios, renderPop })
        );
        break;
      case "visit":
        redirect(`author.html?authorId=${user._id}`);
        break;
      case "account":
        renderPop(Payments(user.payments));
        $(".popup-root .btn").click(() =>
          updatePayments({ $, axios, renderPop, window })
        );
        break;
      case "bills":
        renderPop(Bills({ amount: user.bill }));
        $(".popup-root .btn").click(() => PayBills({ $, axios, renderPop }));
        break;
      case "signout":
        handelSignOut();

      default:
        break;
    }
    $(".app-root .profile-btn").click();
  });
  $(".add-new").click(() => {
    renderPop(NewBook);
    handelImgUpload();
    handelBookUpload();
    const updateBooks = () => console.log("UPD BOOK");
    $(".popup-root .btn").click(() =>
      handelAddBook({ $, axios, callback: updateBooks })
    );
  });
  $("nav ul li:first-child").click();
});

// var monthly_chart = new ApexCharts(
//   document.querySelector(".total_sale #chart"),
//   store_session_chart
// );
// monthly_chart.render();
// monthly_chart.updateSeries([
//   {
//     name: "Orders",
//     data: [
//       { x: "Jan", y: 2000 },
//       { x: "Feb", y: 400000 },
//       { x: "March", y: 3000 },
//     ],
//   },
// ]);
