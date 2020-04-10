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
  description,
  pages,
  category,
  date,
  title,
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
                    <p>Published Date: ${date}</p>
                </div>
            </div>`;

const Books = () => `<div class="book-root">
                        ${searchBar}
                        <div class="books"></div>
                    </div>`;

export { Books, renderBooks, renderBook };
