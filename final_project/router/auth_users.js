const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(404)
      .json({ message: "Please Enter a valid username and password" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const newReviewBody = req.query.review;
  const isbn = req.params.isbn;

  let newUserReview = true;
  let validIsbn = false;

  for (const property in books) {
    if (property == isbn) {
      for (const prop in books[property].reviews) {
        if (prop == req.session.authorization["username"]) {
          books[property].reviews[prop] = newReviewBody;
          newUserReview = false;
          return res.status(200).json({
            data: books[property],
            message: "Review successfully updated!",
          });
        }
      }
      if (newUserReview) {
        books[property].reviews[req.session.authorization["username"]] =
          newReviewBody;
        validIsbn = true;
        return res.status(200).json({
          data: books[property],
          message: "Review successfully added!",
        });
      }
    }
  }
  if (!validIsbn)
    return res.status(402).json({ message: "Book with this ISBN not found!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const reviewUsername = req.body.username;
  const isbn = req.params.isbn;

  let validIsbn = false;

  for (const property in books) {
    if (property == isbn) {
      for (const prop in books[property].reviews) {
        if (
          prop == reviewUsername &&
          reviewUsername != req.session.authorization["username"]
        ) {
          return res.status(403).json({
            message: "You have not authorize for doing this action!",
          });
        }

        if (
          prop == reviewUsername &&
          reviewUsername == req.session.authorization["username"]
        ) {
          const reviewAsArray = Object.entries(books[property].reviews);
          const filteredReviews = reviewAsArray.filter(
            ([key, value]) => key !== reviewUsername
          );
          const filteredReviewsObj = Object.fromEntries(filteredReviews);
          books[property].reviews = filteredReviewsObj;

          return res.status(200).json({
            data: books[property],
            message: "Review successfully Deleted!",
          });
        }
      }
    }
  }
  if (!validIsbn)
    return res.status(402).json({ message: "Book with this ISBN not found!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
