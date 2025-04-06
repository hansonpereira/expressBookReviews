const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ "username": username, "password": password });
  return res.status(201).send(`User ${username} registered successfully`);
});


// Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   return res.send(JSON.stringify(books, null, 4));
// });

// Get the book list available in the shop by using promise
public_users.get('/', async (req, res) => {
  try {
    // Simulate async behavior (if needed in future)
    const data = await Promise.resolve(books);
    return res.send(JSON.stringify(data, null, 4));
  } catch (error) {
    console.error("Error retrieving books:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   if (book) {
//     return res.json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Simulate an async operation using Promise
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((book) => {
      return res.json(book);
    })
    .catch((error) => {
      return res.status(404).json({ message: error });
    });
});

// Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   const authbook = Object.values(books).find(book => book.author === author);

//   if (authbook) {
//     return res.json(authbook);
//   } else {
//     return res.status(404).json({ message: "Author not located" });
//   }
// });

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  // Simulate async operation with Promise
  new Promise((resolve, reject) => {
    const authbook = Object.values(books).find(book => book.author === author);
    if (authbook) {
      resolve(authbook);
    } else {
      reject("Author not located");
    }
  })
    .then((book) => {
      return res.json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   const titlebook = Object.values(books).find(book => book.title === title);

//   if (titlebook) {
//     return res.json(titlebook);
//   } else {
//     return res.status(404).json({ message: "Title not located" });
//   }
// });

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  // Simulate async operation using Promise
  new Promise((resolve, reject) => {
    const titlebook = Object.values(books).find(book => book.title === title);
    if (titlebook) {
      resolve(titlebook);
    } else {
      reject("Title not located");
    }
  })
    .then((book) => {
      return res.json(book);
    })
    .catch((err) => {
      return res.status(404).json({ message: err });
    });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    const reviews = book.reviews;
    return res.json(reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
