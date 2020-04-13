import EmptyShelfSVG from "../../img/book_shelf.svg";
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
const EmptyShelf = `<div class="emptyShelf">
                      <img src=${EmptyShelfSVG}>
                    </div>`;
const searchBar = ` <div class="flex x_flex_end y_center">
                        <fieldset>
                            <div class="searchField">
                                <i class='bx bx-search'></i>
                                <input type="text" name="search" placeholder="Search book">
                            </div>
                        </fieldset>
                    </div>`;

const renderBooks = ({ $, books, parent }) =>
  books.forEach(({ src, id }) =>
    $(parent).append(`<img src=${src} id=${id} alt="">`)
  );

const renderBook = ({
  src,
  _id,
  description,
  pages,
  category,
  date,
  title,
  guest = false,
}) => `<div class="book-detail">
                <i class='bx bx-x'></i>
                <div class="left"><img src=${src} alt=""></div>
                <div class="right">
                    <h1>${title}</h1>
                    <h2>Description</h2>
                    <p>${description}
                    </p>
                    <h2>Book Detail</h2>
                    <p>Pages : ${pages}</p>
                    <p>Category : ${category}</p>
                    <p>Published Date: ${
                      months[date.getMonth()]
                    }-${date.getDate()}-${date.getFullYear()}</p>
                    ${!guest ? "" : ' <p class="checkout-btn">Buy Book</p>'}
                </div>
            </div>`;

const Books = () => `<div class="book-root">
                        ${searchBar}
                        <div class="books"></div>
                    </div>`;

const NewBook = `
            <div class="add-new-book-root">
                <div class="srcoll-div">
                    <h2>Enter book information</h2>
                    <i class='bx bx-x'></i>
                    <fieldset class="y_center">
                        <input style="display:none" type="file" name="src" accept="image/*"/>
                        <img id="img-picker"
                            class="blank"
                            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAYAAADhAJiYAAABAUlEQVRYhe2XwXHCMBBFXQIlUAIluAQ6CCWkA9xJWqADfHtfuiidkA6cQ2xG8YCxQNJw2D/zb9bqzf4dSW4akymzgK1z7sM5d8xp7/0uGcZ7v5N0kTQU8lcSkKTvgjCDpCGpU6VhJA1AZ0AGZEBP+Gf0ewABrXNu/xZA8QaSTrWB/kUD9PH6EMLmUXRZgYAW6Ca4EMJmXuNRdNmApkJTF4B2oc4paeNUoHk0wHapzgj9WQroZjRVdG9uXq0bzd3LMxTWvghrAa22AaUAAV0cp6Rz9O15ddxAnwMoW3fHv45Vt3YVoKb5O9SAA9CleB7ZzNfOA/3S2ip6eqgNyIBMBfQL4L8zDmJNrg4AAAAASUVORK5CYII=" />
                        <label for="src" class="msg"></label>
                    </fieldset>
                    <fieldset class="y_center">
                        <input style="display:none" type="file" name="file" accept=".epub,.mobi,.pdf"/>
                        <span class="file-picker" id="file-picker">Upload Ebook</span>
                        <label for="src" class="msg"></label>
                    </fieldset>
                    <fieldset>
                        <div class="textField">
                            <input autocomplete="none" type="text" name="name" autofocus placeholder="Enter bookname" />
                        </div>
                        <label for="name" class="msg"></label>
                    </fieldset>
                    <fieldset class="category-root">
                        <span class="active">Biography</span>
                        <label for="category" class="msg"></label>
                        <ul>
                            <li>Arts & Photography</li>
                            <li>Biography</li>
                            <li>Bussiness & Investing</li>
                            <li>Children's Book</li>
                            <li>Comic & Graphic Novel</li>
                            <li>Cooking</li>
                            <li>Fantasy</li>
                            <li>History</li>
                            <li>Horror</li>
                            <li>Mystery & Thrillers</li>
                            <li>Romance</li>
                            <li>Religion</li>
                            <li>Science & Technology</li>
                            <li>Travel</li>
                        </ul>
                    </fieldset>
                    <fieldset>
                        <div class="textField">
                            <textarea placeholder="Enter description" name="desc" id="" cols="30" rows="10"></textarea>
                        </div>
                        <label for="desc" class="msg"></label>
                    </fieldset>
                    <fieldset>
                        <div class="textField">
                            <input autocomplete="none" type="text" name="page" autofocus
                                placeholder="Enter page number" />
                        </div>
                        <label for="page" class="msg"></label>
                    </fieldset>
                    <fieldset>
                        <div class="textField">
                            <input autocomplete="none" type="text" name="price" autofocus
                                placeholder="Enter price in Ks" />
                        </div>
                        <label for="price" class="msg"></label>
                    </fieldset>
                    <div class="btn">
                        <input type="submit" name="submit" value="Add Book" />
                    </div>
                </div>
            </div>`;

const handelAddBook = ({ $, axios }) => {
  const src = $("input[name=src]").prop("files")[0],
    file = $("input[name=file]").prop("files")[0],
    name = $("input[name=name]"),
    desc = $("textarea[name=desc]"),
    price = $("input[name=price]"),
    page = $("input[name=page]"),
    category = $(".popup-root span.active").html(),
    error = {};
  if (!name.val()) error.name = "Enter book name";
  if (!desc.val()) error.desc = "Enter book description";
  if (!price.val()) error.price = "Enter book price";
  else if (isNaN(price.val())) error.price = "Enter only numbers";
  else if (parseInt(price.val()) < 1000) error.price = "Minium price is 1000Ks";
  if (!page.val()) error.page = "Enter page number";
  else if (isNaN(page.val())) error.page = "Enter only numbers";
  if (error.name) {
    name.parents("fieldset").addClass("err");
    name
      .parent()
      .siblings(".msg")
      .html(`<i class='bx bxs-error-circle' ></i>${error.name}`);
  }
  if (error.desc) {
    desc.parents("fieldset").addClass("err");
    desc
      .parent()
      .siblings(".msg")
      .html(`<i class='bx bxs-error-circle' ></i>${error.desc}`);
  }
  if (error.price) {
    price.parents("fieldset").addClass("err");
    price
      .parent()
      .siblings(".msg")
      .html(`<i class='bx bxs-error-circle' ></i>${error.price}`);
  }
  if (error.page) {
    page.parents("fieldset").addClass("err");
    page
      .parent()
      .siblings(".msg")
      .html(`<i class='bx bxs-error-circle' ></i>${error.page}`);
  }
  if (!src) {
    $("img.blank").addClass("err");
  }
  if (!file) {
    $("#file-picker").addClass("err");
  }
  if (!$("fieldset.err").length && src && file) {
    const form = new FormData();
    const img = $("#img-picker").attr("src");
    form.append("name", name.val());
    form.append("description", desc.val());
    form.append("category", category);
    form.append("price", price.val());
    form.append("pages", page.val());
    form.append("ebook", file);
    form.append("img", img);
    $(".linear-progress-material.show").addClass("show");
    axios
      .post("user/book", form)
      .then((res) => {
        $(".linear-progress-material.show").removeClass("show");
        callback();
      })
      .catch((err) => {
        $(".linear-progress-material.show").removeClass("show");
        console.log({ err });
      });
  }
};

export { Books, renderBooks, renderBook, NewBook, handelAddBook, EmptyShelf };
