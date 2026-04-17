const express = require("express");
const public_users = express.Router();
const books = require("../booksdb.js");
let users = require("./auth_users.js");

// ─── Helper: check if user already exists ───────────────────────────────────
const doesExist = (username) =>
  users.some((u) => u.username === username);

// ─── Task 6 – Register a new user ────────────────────────────────────────────
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }
  if (doesExist(username)) {
    return res.status(409).json({ message: "User already exists. Please choose a different username." });
  }
  users.push({ username, password });
  return res.status(201).json({ message: `User '${username}' successfully registered. You can now log in.` });
});

// ─── Task 1 – Get all books (callback/promise style used in general.js) ──────
public_users.get("/", (req, res) => {
  res.status(200).json(books);
});

// ─── Task 2 – Get book by ISBN ───────────────────────────────────────────────
public_users.get("/isbn/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
});

// ─── Task 3 – Get books by author ────────────────────────────────────────────
public_users.get("/author/:author", (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = {};
  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase().includes(author)) {
      result[key] = books[key];
    }
  });
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "No books found for author: " + req.params.author });
});

// ─── Task 4 – Get books by title ─────────────────────────────────────────────
public_users.get("/title/:title", (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = {};
  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase().includes(title)) {
      result[key] = books[key];
    }
  });
  if (Object.keys(result).length > 0) {
    return res.status(200).json(result);
  }
  return res.status(404).json({ message: "No books found with title: " + req.params.title });
});

// ─── Task 5 – Get book reviews ───────────────────────────────────────────────
public_users.get("/review/:isbn", (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({ message: "Book not found for ISBN: " + isbn });
});

module.exports.general = public_users;