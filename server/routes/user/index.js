const express = require("express");
const multer = require("multer");
const FileType = require("file-type");
const app = express();
const Token = require("../../models/Token");
const User = require("../../models/User");
const Book = require("../../models/Book");
const Order = require("../../models/Order");
const Bill = require("../../models/Bill");
const status = require("../../status");
const upload = multer({ dest: "uploads/" });

app.use((req, res, next) => {
  req.token = req.header("x-auth-token");
  Token.findOne({ _id: req.token })
    .then((token) => {
      if (token) {
        req.uid = token.user_id;
        next();
      } else res._status(status.NOT_EXIST);
    })
    .catch((err) => {
      // !console.log(err);
      res._status(status.SRV_ERR);
    });
});
app.get("/", async (req, res) => {
  const user = await User.findOne({ _id: req.uid });
  const books = await Book.find({ author: user._id });
  const orders = await Order.find({ author: req.uid }).sort({ date: -1 });
  res.json({ user, books, orders });
});

app.put("/", async (req, res) => {
  const { name, avatar } = req.body;
  User.findOne({ _id: req.uid }).then((user) => {
    user.name = name;
    user.avatar = avatar;
    user
      .save()
      .then((user) => {
        res.json(user);
      })
      .catch((err) => console.log(err));
  });
});
app.post("/archive/:id", async (req, res) => {
  const _id = req.params.id;
  const order = await Order.findOne({ _id });
  const book = await Book.findOne({ _id: order.bookid });
  const user = await User.findOne({ _id: order.author });
  const { ext } = await FileType.fromFile("./uploads/" + book.file);
  const message = {
    to: order.customer_email,
    subject: "Booky",
    html: `<h1>Dear user,your order has been verified,The book  is attached in this mail</h1>`,
    attachments: [
      {
        filename: `${book.name}.${ext}`,
        path: `./uploads/${book.file}`,
      },
    ],
  };
  res.mail(
    message,
    (err) => console.log(err),
    () => {
      user.bill += book.price * 0.005;
      order.status = "archive";
      user
        .save()
        .then(() => {
          order
            .save()
            .then((order) => res._status(200))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    }
  );
});
app.post(
  "/book",
  upload.fields([{ name: "ebook", maxCount: 1 }]),
  (req, res) => {
    const { name, description, category, price, img, pages } = req.body,
      {
        ebook: [{ filename: file }],
      } = req.files;

    const newBook = new Book({
      name,
      description,
      category,
      price,
      file,
      pages,
      img,
      author: req.uid,
    });
    newBook
      .save()
      .then((book) => res.json(book))
      .catch((err) => res_status(status.SRV_ERR));
  }
);
app.post("/signout", (req, res) => {
  Token.deleteMany({ _id: req.token }).then((rows) => res._status(status.OK));
});
app.post("/payment", (req, res) => {
  const payments = req.body;
  User.findOne({ _id: req.uid }).then((user) => {
    user.payments = payments;
    user
      .save()
      .then((user) => res.json(user))
      .catch((err) => console.log(err));
  });
});
app.post("/paybill", (req, res) => {
  const { gateway, accId } = req.body,
    uid = req.uid;
  const bill = new Bill({ gateway, accId, uid });
  const sendId = gateway.toLowerCase().includes("pay")
    ? "09790551585"
    : gateway.toLowerCase() === "kbzbank"
    ? "0000 8999 8766 8988 "
    : "000 8888 9999 5555";
  bill
    .save()
    .then((bill) => res.send(sendId))
    .catch((err) => console.log(err));
});
module.exports = app;
/*
[{ name: "cover", maxCount: 1 },{ name: "ebook", maxCount: 1 }]

const {cover: [{ filename: img }],
 ebook: [{ filename: file }],
      } = req.files

      */
