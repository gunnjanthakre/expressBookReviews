const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("../booksdb.js");
let users = require("./auth_users.js");
const regd_users = express.Router();
const JWT_SECRET = "fingerprint_customer";

const authenticatedUser = (username, password) =>
  users.some((u) => u.username === username && u.password === password);

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required." });
  if (!authenticatedUser(username, password))
    return res.status(401).json({ message: "Invalid credentials." });
  const token = jwt.sign({ data: username }, JWT_SECRET, { expiresIn: "1h" });
  req.session.authorization = { accessToken: token, username };
  return res.status(200).json({ message: `User '${username}' logged in successfully.`, token });
});

const verifyJWT = (req, res, next) => {
  const token = req.session?.authorization?.accessToken;
  if (!token) return res.status(403).json({ message: "User not logged in." });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.data;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

regd_users.put("/auth/review/:isbn", verifyJWT, (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const review = req.query.review;
  const username = req.user;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found." });
  if (!review) return res.status(400).json({ message: "Review query param required." });
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `Review added/updated.`, reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", verifyJWT, (req, res) => {
  const isbn = parseInt(req.params.isbn);
  const username = req.user;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found." });
  if (!books[isbn].reviews[username]) return res.status(404).json({ message: "No review found." });
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: `Review deleted.`, reviews: books[isbn].reviews });
});

module.exports = { authenticated: regd_users };
