const { default: axios } = require("axios");
const baseUrl = "http://localhost:5000";

const getBooks = async (req, res) => {
  const response = await axios.get(`${baseUrl}`);
  if ((response.status = 200)) {
    return {
      books: response.data.data,
    };
  }

  return {
    error: response.data.message,
  };
};

const getBookByIsbn = async (req, res) => {
  const response = await axios.get(`${baseUrl}/isbn/2`);
  if ((response.status = 200)) {
    return {
      books: response.data.data,
    };
  }

  return {
    error: response.data.message,
  };
};

const getBookByAuthor = async (req, res) => {
  const response = await axios.get(`${baseUrl}/author/Unknown`);
  if ((response.status = 200)) {
    return {
      books: response.data.data,
    };
  }

  return {
    error: response.data.message,
  };
};

const getBookByTitle = async (req, res) => {
  const response = await axios.get(`${baseUrl}/title/The Divine Comedy`);
  if ((response.status = 200)) {
    return {
      book: response.data.data,
    };
  }

  return {
    error: response.data.message,
  };
};

//test getbooks
// setTimeout(async () => {
//   const books = await getBooks();
//   console.log(books);
// }, 2000);

//test get book by ISBN
// setTimeout(async () => {
//   const book = await getBookByIsbn();
//   console.log(book);
// }, 2000);

//test get book by author
// setTimeout(async () => {
//   const books = await getBookByAuthor();
//   console.log(JSON.stringify(books));
// }, 2000);

//test get book by title
setTimeout(async () => {
  const books = await getBookByTitle();
  console.log(JSON.stringify(books));
}, 2000);
