const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const itemRoutes = require('./routes/item');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3300;

// Middleware to parse JSON
app.use(express.json());

// Database connection to MongoDB Atlas using Mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_ATLAS, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();

// Routes
app.use('/api/users', userRoutes); 
app.use('/api/items', itemRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
