const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res
    .status(400)
    .json({ message: "username or password is not properly defined" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  // const response = books;
  // return res.status(200).json({ message: "All books", data: response });

  try {
    const booksPromise = new Promise((resolve) => resolve(books));
    const response = await booksPromise;
    return res.status(200).json({ message: "All books", data: response });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  // const isbn = req.params.isbn;
  // let response = books[isbn];
  // if (response) {
  //   return res
  //     .status(200)
  //     .json({ message: `Book of ISBN: ${isbn}`, data: response });
  // } else {
  //   return res.status(404).json({ message: `No books found` });
  // }

  try {
    const isbn = req.params.isbn;
    const bookPromise = new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) resolve(book);
      else reject("No book found");
    });
    const response = await bookPromise;
    return res
      .status(200)
      .json({ message: `Book of ISBN: ${isbn}`, data: response });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  //Write your code here
  // const authorId = req.params.author;
  // const response = Object.values(books).filter(
  //   (book) => book.author == authorId
  // );

  // if (response && response.length) {
  //   return res
  //     .status(200)
  //     .json({ message: "Books of this author", data: response });
  // } else {
  //   return res.status(404).json({ message: "No books found of this author" });
  // }

  try {
    const authorId = req.params.author;
    const booksByAuthorPromise = new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (book) => book.author === authorId
      );
      if (filteredBooks.length > 0) resolve(filteredBooks);
      else reject("No books found for this author");
    });
    const response = await booksByAuthorPromise;
    return res
      .status(200)
      .json({ message: "Books of this author", data: response });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  //Write your code here
  // const title = req.params.title;
  // const response = Object.values(books).find((book) => book.title == title);

  // if (response) {
  //   return res
  //     .status(200)
  //     .json({ message: "Book of this title", data: response });
  // } else {
  //   return res.status(404).json({ message: "No book was found of this title" });
  // }

  try {
    const title = req.params.title;
    const bookByTitlePromise = new Promise((resolve, reject) => {
      const book = Object.values(books).find((book) => book.title === title);
      if (book) resolve(book);
      else reject("No book was found with this title");
    });
    const response = await bookByTitlePromise;
    return res
      .status(200)
      .json({ message: "Book of this title", data: response });
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  if (book) {
    return res
      .status(200)
      .json({ message: `Reviews of book ISBN: ${isbn}`, data: book.reviews });
  } else {
    return res.status(404).json({ message: `No book found` });
  }
});

module.exports.general = public_users;
