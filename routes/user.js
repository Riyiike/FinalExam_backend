const express = require('express');
const router = express.Router();
const User = require('../models/user');


// POST  - Create a new user
router.post('/newuser', async (req, res) => {
    const { email, username } = req.body;

    try {
        // Check if a user with the same email or username already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(409).json({ 
                message: 'User with this email or username already exists' 
            });
        }

        // Create a new user
        const newUser = new User({ email, username });

        // Save the new user to the database
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        // Handle other potential errors
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
        const { email, username } = req.body;

        // Check if another user with the same email or username exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
            _id: { $ne: req.params.id }  // Exclude the current user by ID
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Another user with this email or username already exists'
            });
        }

        // Update the user
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { email, username },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid user ID' });
        }
        res.status(500).json({ message: err.message });
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
