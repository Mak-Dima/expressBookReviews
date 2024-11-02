const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (isValid(username)) {
    return res.status(401).json({message: "User already exists!"})
  }

  users.push({username: username, password: password})

  return res.status(201).json({username: username, password: password})

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
    
  for (const elem in books) {
    if (elem === req.params.isbn) {
      return res.status(200).json(books[elem]);
    }
  }

  return res.status(404).json({message: "Book not found."});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  for (const elem in books) {
    if (books[elem].author === req.params.author) {
      return res.status(200).json(books[elem])
    }
  }

  return res.status(404).json({message: "Book not found."});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  for (const elem in books) {
    if (books[elem].title === req.params.title) {
      return res.status(200).json(books[elem])
    }
  }

  return res.status(404).json({message: "Book not found."});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  for (const elem in books) {
    if (elem === req.params.isbn) {
      return res.status(200).json({reviews: books[elem].reviews})
    }
  }

  return res.status(404).json({message: "Review not found."});
});

module.exports.general = public_users;
