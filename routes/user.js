const express = require('express');
const router = express.Router();
const User = require('../models/user');


// POST api/newuser - Create a new user
router.post('/newuser', async (req, res) => {
    const { id, email, username } = req.body;
    const newUser = new User({ id, email, username });

    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET api/getusers - Get all users
router.get('/getusers', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET api/getuser/:id - Get user by ID
router.get('/getuser/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// PUT /user/:id - Update a user by ID
router.put('/item/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,  // Use the _id directly for the query
            { name: req.body.name, price: req.body.price, description: req.body.description },
            { new: true }  // This option returns the updated document
        );
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE /user/:id - Delete a user by ID
router.delete('/item/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id); 
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// GET api/getrandomitem - Get a random item
router.get('/getrandomitem', async (req, res) => {
    try {
        const count = await Item.countDocuments();  
        const random = Math.floor(Math.random() * count);
        const item = await Item.findOne().skip(random);  
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;