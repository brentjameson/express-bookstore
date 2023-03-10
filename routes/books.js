const express = require("express");
const ExpressError = require("../expressError")
const Book = require("../models/book");
const jsonschema = require("jsonschema");
const bookSchema = require("../schemas/bookSchema.json");
const { handleInvalidBookErrors } = require("../models/book");

const router = new express.Router();


/** GET / => {books: [book, ...]}  */

router.get("/", async function (req, res, next) {
  try {
    const books = await Book.findAll(req.query);
    return res.json({ books });
  } catch (err) {
    return next(err);
  }
});

/** GET /[id]  => {book: book} */

router.get("/:id", async function (req, res, next) {
  try {
    const book = await Book.findOne(req.params.id);
    return res.json({ book });
  } catch (err) {
    return next(err);
  }
});

/** POST /   bookData => {book: newBook}  */

router.post("/", async function (req, res, next) {
  try {
    // validate data
    const result = await Book.validateBookData(req.body);
    // if data is not valid, return a list of errors
    if (!result.valid) {
      const listOfErrors = await Book.handleInvalidBookErrors(result);
      return next(listOfErrors);
    }
    // if data is valid, create new book and return book data
    const book = await Book.create(req.body);
    return res.status(201).json({ book });
    
  } catch (err) {
    return next(err);
  }
});

/** PUT /[isbn]   bookData => {book: updatedBook}  */

router.put("/:isbn", async function (req, res, next) {
  try {
    // validate data
    const result = await Book.validateBookData(req.body);
    // if data is not valid, return a list of errors
    if (!result.valid) {
      const listOfErrors = await Book.handleInvalidBookErrors(result);
      return next(listOfErrors);
    }
    // if data is valid, create new book and return book data
    const book = await Book.update(req.params.isbn, req.body);
    return res.status(201).json({ book });
    
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[isbn]   => {message: "Book deleted"} */

router.delete("/:isbn", async function (req, res, next) {
  try {
    await Book.remove(req.params.isbn);
    return res.json({ message: "Book deleted" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
