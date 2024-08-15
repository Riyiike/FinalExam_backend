const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: Number, unique: true, required: true },
    email: { type: String, required: true },
    username: { type: String }
});

module.exports = mongoose.model('User', userSchema,'FinalExam24');