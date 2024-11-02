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
  let promise = new Promise((resolve, reject) => {

    setTimeout(() => {
      resolve(books)
    }, 3000)

  })

  promise.then((data) => {
    return res.status(200).json(data)
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const elem in books) {
        if (elem === req.params.isbn) {
          resolve(books[elem])
          return
        } 
      }
      reject({message: "Book not found."})
    }, 3000)
  }) 

  promise.then((data) => {
    return res.status(200).json(data)
  })
  .catch((err) => {
    return res.status(404).json(err);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const elem in books) {
        if (books[elem].author === req.params.author) {
          resolve(books[elem])
        }
      }
      reject({message: "Book not found."})
    }, 3000)
  })

  promise.then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(404).json(err)
  })

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      for (const elem in books) {
        if (books[elem].title === req.params.title) {
          resolve(books[elem])
        }
      }
      reject({message: "Book not found."})
    }, 3000)
  })

  promise.then((data) => {
    res.status(200).json(data)
  })
  .catch((err) => {
    res.status(404).json(err)
  })
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
