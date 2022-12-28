const express = require("express");
const router = express.Router();
const Book = require('../../models/Book');

// To post to this specific bookRoute, use API endpoint http://localhost:3000/books/crazy
router.post('/crazy', (req, res) => {
  Book.create({
    title: req.body.title,
    author: req.body.author
  })
  .then((newBook) => {
    res.json(newBook);
  })
  .catch((err) => {
    res.json(err);
  })
})

// To post to this specific bookRoute, use API endpoint http://localhost:3000/books/amazing
router.post('/amazing', (req, res) => {
  Book.create({
    title: req.body.title,
    author: req.body.author
  })
  .then((newBook) => {
    res.json(newBook.title);
  })
  .catch((err) => {
    res.json(err);
  })
})

module.exports = router;