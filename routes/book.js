const express = require('express');
const router = express.Router();
const Book = require('../models/book');


// Get all books 
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Get book by ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Add new book
router.post('/', async (req, res) => {
    const { bookTitle, bookAuthor, description } = req.body;

    try {
        const existingBook = await Book.findOne({ bookTitle });
        if (existingBook) {
            return res.status(409).json({ message: 'Book with this title already exists' });
        }
        const newBook = new Book({ bookTitle, bookAuthor, description });
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// update book
router.put('/:id', async (req, res) => {
    try {
        const { bookTitle, bookAuthor, description } = req.body;
        const existingBook = await Book.findOne({ bookTitle });
        if (existingBook && existingBook._id.toString() !== req.params.id) {
            return res.status(409).json({ message: 'Another book with this title already exists' });
        }
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { bookTitle, bookAuthor, description },
            { new: true, runValidators: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        res.status(500).json({ message: err.message });
    }
});

// delete book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;