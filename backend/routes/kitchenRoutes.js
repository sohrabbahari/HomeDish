// backend/routes/kitchenRoutes.js
const express = require('express');
const router = express.Router();

// Assume we have Kitchen model to handle DB operations
const Kitchen = require('../models/kitchenModel');

// GET all kitchens
router.get('/', async (req, res) => {
  try {
    const kitchens = await Kitchen.find();
    res.json(kitchens);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create a new kitchen listing
router.post('/', async (req, res) => {
  const { kitchenName, address, cuisine, imageUri } = req.body;
  const newKitchen = new Kitchen({
    kitchenName,
    address,
    cuisine,
    imageUri
  });

  try {
    const createdKitchen = await newKitchen.save();
    res.status(201).json(createdKitchen);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET a single kitchen by ID
router.get('/:id', async (req, res) => {
  try {
    const kitchen = await Kitchen.findById(req.params.id);
    if (kitchen) {
      res.json(kitchen);
    } else {
      res.status(404).json({ message: 'Kitchen not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
