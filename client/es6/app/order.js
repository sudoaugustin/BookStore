const order_row = (order) => {
  const { id, img, name, edition = " ", email, price, payment } = order;
  return `<tr id=${id}>
                <td>
                <ul class="flex">
                    <li><img src=${img} alt=""></li>
                    <li>
                        <p>${name}</p><span>${edition}</span>
                    </li>
                </ul>
                </td>
            <td>${email}</td>
            <td class="price">
                <p>${price}Ks</p>
                <span>${payment}</span>
            </td>
            <td>
                <p id=${id} class="archive-btn">Archive</p>
            </td>
        </tr>`;
};

const order_tabel = (status) => `
                                <div class="tabel-root ${
                                  status === "pending" ? "" : "archive-root"
                                }">
                                    <h3>${status} Orders</h3>
                                    <table>
                                        <tr>
                                            <th>Book </th>
                                            <th>Customer's email</th>
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
  email,
  price,
  phone,
  payment,
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
                <p>Email : ${email}</p>
                <p>Phone : ${phone}</p>
                <p>Payment : ${payment}</p>
                <p>Date : ${date}</p>
            </div>
            <p class="archive-btn" id=${id}>Archive</p>
            <i class='bx bx-x'></i>
        </div>`;

const Orders = ({ status }) => order_tabel(status);

export { Orders, renderOrder, renderOrders };
