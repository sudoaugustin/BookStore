import emptyOrderSVG from "../../img/empty_order.svg";
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
const order_row = (order) => {
  const {
    id,
    img,
    name,
    category = " ",
    customer_email,
    customer_phone,
    price,
    gateway,
  } = order;
  return `<tr id=${id}>
                <td>
                <ul class="flex">
                    <li><img src=${img} alt=""></li>
                    <li>
                        <p>${name}</p><span>${category}</span>
                    </li>
                </ul>
                </td>
            <td> 
                <p>${customer_phone}Ks</p>
                <span>${customer_email}</span>
            </td>
            <td class="price">
                <p>${price}Ks</p>
                <span>${gateway}</span>
            </td>
            <td>
                <p id=${id} class="archive-btn">Archive</p>
            </td>
        </tr>`;
};
const EmptyOrder = `<div class="emptyShelf">
                      <img src=${emptyOrderSVG}>
                    </div>`;

const order_tabel = (status) => `
                                <div class="tabel-root ${
                                  status === "pending"
                                    ? "pending-root"
                                    : "archive-root"
                                }">
                                    <h3>${status} Orders</h3>
                                    <table>
                                        <tr>
                                            <th>Book </th>
                                            <th>Customer  Info</th>
                                            <th class="price">Amount</th>
                                            <th></th>
                                        </tr>
                                    </table>
                                </div>`;

const renderOrders = ({ $, orders }) =>
  orders.forEach((order) => $(".tabel-root table").append(order_row(order)));

const renderOrder = (order) => order_detail(order);

const order_detail = ({
  id,
  img,
  name,
  edition = " ",
  customer_email,
  price,
  customer_phone,
  gateway,
  date,
  className,
}) => `<div class="order-detail-root ${className}">
            <div class="book">
                <img src=${img} alt="">
                <h2>${name}</h2>
                <span class="edition">${edition}</span>
            </div>
            <div class="customer">
                <p>Price : ${price + "Ks"}</p>
                <p>Email : ${customer_email}</p>
                <p>Phone : ${customer_phone}</p>
                <p>Payment : ${gateway}</p>
                <p>Date : ${
                  months[date.getMonth()]
                }-${date.getDate()}-${date.getFullYear()}</p>
            </div>
            <p class="archive-btn" id=${id}>Archive</p>
            <i class='bx bx-x'></i>
        </div>`;

const Orders = ({ status }) => order_tabel(status);
const handelArchive = ({ $, axios, updateOrdersQty }) => {
  $(".archive-btn").click((e) => {
    e.preventDefault();
    const {
      delegateTarget: { id },
    } = e;
    $(".linear-progress-material").addClass("show");
    axios
      .post("user/archive/" + id)
      .then((res) => {
        $(".linear-progress-material.show").removeClass("show");
        $(".pending-root.tabel-root tr#" + id).remove();
        const i = window.orders.findIndex((order) => order._id === id);
        window.orders[i].status = "archive";
        updateOrdersQty();
      })
      .catch((err) => {
        $(".linear-progress-material.show").removeClass("show");
      });
    e.stopPropagation();
    return;
  });
};
export { Orders, renderOrder, renderOrders, EmptyOrder, handelArchive };
