const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bookRoutes = require('./routes/book');


dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 5001;

// Middleware to parse JSON
app.use(express.json());

// Database connection to MongoDB Atlas using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.URI, {
        });
        console.log('MongoDB Atlas connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/v1/book', bookRoutes); 


app.get('/', (req, res) => {
    res.send('Hello!! API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});