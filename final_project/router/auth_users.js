const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send(`User ${username} successfully logged in`);
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const review = req.query.review;
  if (!review) {
    return res.status(404).json({ message: "Review not provided" });
  }
  const book = books[isbn];
  if (book) {
    if (book.reviews[username]) {
      // Update existing review
      book.reviews[username] = review;
      return res.send(`Review for ISBN ${isbn} updated by ${username}`);
    } else {
      // Add new review
      book.reviews[username] = review;
      books[isbn] = book;
      return res.send(books[isbn])
      return res.send(`Review for ISBN ${isbn} has been added by ${username}`);
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  const book = books[isbn];
  if (book) {
    if (book.reviews[username]) {
      // Delete review
      delete book.reviews[username];
      books[isbn] = book;
      return res.send(`Review for ISBN ${isbn} deleted by ${username}`);
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
