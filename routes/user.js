const express = require('express');
const router = express.Router();
const User = require('../models/user');


// POST  - Create a new user
router.post('/newuser', async (req, res) => {
    const { email, username } = req.body;
    const newUser = new User({ email, username });

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

//  Get user by ID
router.get('/getuser/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); 
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update a user by ID
router.put('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            { email: req.body.email, username: req.body.username },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
 
//  Delete a user by ID
router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id); 
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
