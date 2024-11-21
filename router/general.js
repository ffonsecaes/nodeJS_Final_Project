const express = require('express');
let books = require("./booksdb.js");
const { readFileSync, readFile } = require('fs');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs = require('fs/promises')
const path = require('path')



public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password })
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  } else {
    return res.status(404).json({ message: "Please complete all values!" });
  }

});


// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const filePath = path.join(__dirname, 'books.json')
    const booksData = await fs.readFile(filePath, 'utf-8')
    return res.status(200).send(JSON.stringify(booksData, null, 4));
  } catch (error) {
    return res.status(500).send("No file to read");
  }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  const filePath = path.join(__dirname, 'books.json')

  try {
    const booksData = await fs.readFile(filePath, 'utf-8')
    let data = JSON.parse(booksData)
    let filteredBook = data[isbn]
    return res.status(200).send(JSON.stringify(filteredBook, null, 4));
  } catch (error) {
    return res.status(500).send("No Book with that ID")
  }




});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author
  const filePath = path.join(__dirname, "books.json")

  try {

    const booksData = await fs.readFile(filePath, 'utf-8')
    let data = JSON.parse(booksData)
    const arrayOfBooks = Object.values(data)
    let filteredBook = arrayOfBooks.filter(book => {
      if (book.author === author) {
        return book
      }
    })
    return res.status(300).send(JSON.stringify(filteredBook, null, 4));
  } catch (error) {
    return res.status(500).send("Error no such Book")
  }

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title
  const filePath = path.join(__dirname, 'books.json')

  try {
    let booksData = await fs.readFile(filePath, 'utf-8');
    let data = JSON.parse(booksData);
    const arrayOfBooks = Object.values(data)

    let filteredBook = arrayOfBooks.filter(book => {
      if (book.title === title) {
        return book
      }
    })
    return res.status(300).send(JSON.stringify(filteredBook, null, 4));
  } catch (error) {
    return res.status(500).send("No such title")
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn

  let filteredReview = books[isbn].reviews
  return res.status(300).send(JSON.stringify(filteredReview));
});

module.exports.general = public_users;
