const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// POST api/newitem - Create a new item
router.post('/additem', async (req, res) => {
    const { name, price, description } = req.body;

    try {
        // Check if an item with the same name already exists
        const existingItem = await Item.findOne({ name });
        if (existingItem) {
            return res.status(409).json({ message: 'Item with this name already exists' });
        }

        // Create a new item
        const newItem = new Item({ name, price, description });

        // Save the new item to the database
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        // Handle other potential errors
        res.status(400).json({ message: err.message });
    }
});

// GET api/getitems - Get all items
router.get('/getitems', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET api/getitem/:id - Get item by ID
router.get('/getitem/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id); 
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// PUT api/item/:id - Update an item by ID
// router.put('/item/:id', async (req, res) => {
//     try {
//         const item = await Item.findByIdAndUpdate(
//             req.params.id,  
//             { name: req.body.name, price: req.body.price, description: req.body.description },
//             { new: true } 
//         );
//         if (!item) return res.status(404).json({ message: 'Item not found' });
//         res.json(item);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

router.put('/item/:id', async (req, res) => {
    try {
        const { name, price, description } = req.body;

        // Check if there's another item with the same name
        const existingItem = await Item.findOne({ name });
        if (existingItem && existingItem._id.toString() !== req.params.id) {
            return res.status(409).json({ message: 'Another item with this name already exists' });
        }

        // Update the item
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            { name, price, description },
            { new: true, runValidators: true }
        );

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json(item);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid item ID' });
        }
        res.status(500).json({ message: err.message });
    }
});
// DELETE api/item/:id - Delete an item by ID
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
