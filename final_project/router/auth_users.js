const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  if (users.find((elem) => elem.username === username)) {
    return true
  }
  return false
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let isAuthenticated = users.find((elem) => {
    return elem.username === username && elem.password === password
  })

  if (isAuthenticated) {
    return true
  }

  return false
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username
  const password = req.body.password

  if (!(username || password)) {
    return res.status(401).json({message: "Provide username and password"})
  }

  if (!isValid(username)) {
    return res.status(401).json({message: "User does not exists!"})
  }

  if (!authenticatedUser(username, password)) {
    return res.status(208).json({message: "Invalid credentials!"})
  }

  let tocken = jwt.sign({data: password}, 'access', {expiresIn: 60 * 60})

  req.session.authorization = { tocken, username }

  return res.status(200).json({username: username, password: password})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const userName = req.session.authorization.username

  for (const elem in books) {
    if (elem === req.params.isbn) {
      for (const review in books[elem].reviews) {
        if (review === userName) {
            books[elem].reviews[userName] = req.body.review
            return res.status(200).json({username: userName, review: req.body.review});
        }
      }
      books[elem].reviews[userName]= req.body.review
    }
  }

  return res.status(200).json({username: userName, review: req.body.review});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const userName = req.session.authorization.username

  for (const elem in books) {
    if (elem === req.params.isbn) {
      for (const review in books[elem].reviews) {
        if (review === userName) {
            const review  = books[elem].reviews[userName]
            delete books[elem].reviews[userName]
            return res.status(200).json(
              {
                username: userName,
                review: review,
                status: "deleted"
              }
            );
        }
      }
    }
  }



});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
