const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
    description: { type: String }
});

module.exports = mongoose.model('book', bookSchema,'300378824-Iyanuoluwa');
