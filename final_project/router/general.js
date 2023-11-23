const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res
    .status(404)
    .json({ message: "Please Enter a valid username and password" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({
    data: books,
    message: "Successfully fetched books data!",
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let filteredBook;

  for (const property in books) {
    if (property == isbn) {
      filteredBook = { isbn: property, book: books[property] };
    }
  }

  if (!filteredBook)
    return res.status(402).json({ message: "Book with this ISBN not found!" });

  return res
    .status(200)
    .json({ data: filteredBook, message: "Book successfully found!" });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  let filteredBook = [];

  let booksKeys = Object.keys(books);
  booksKeys.forEach((key) => {
    if (books[key].author == author) {
      filteredBook.push({ isbn: key, book: books[key] });
    }
  });

  if (!filteredBook.length > 0)
    return res
      .status(402)
      .json({ message: "Book with this author name not found!" });

  return res
    .status(200)
    .json({ data: filteredBook, message: "Book successfully found!" });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  let filteredBook = [];

  let booksKeys = Object.keys(books);
  booksKeys.forEach((key) => {
    books[key].title == title
      ? filteredBook.push({ isbn: key, book: books[key] })
      : null;
  });

  if (!filteredBook.length > 0)
    return res.status(402).json({ message: "Book with this title not found!" });

  return res
    .status(200)
    .json({ data: filteredBook, message: "Book successfully found!" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  let validIsbn = false;
  let filteredReview;

  for (const property in books) {
    if (property == isbn) {
      filteredReview = { isbn: property, reviews: books[property].reviews };
      validIsbn = true;
    }
  }

  if (!validIsbn)
    return res.status(402).json({ message: "Book with this ISBN not found!" });

  return res
    .status(200)
    .json({ data: filteredReview, message: "Review successfully fetched!" });
});

module.exports.general = public_users;
