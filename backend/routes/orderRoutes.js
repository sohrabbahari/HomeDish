// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

// GET all orders for a specific user
router.get('/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST to create a new order
router.post('/', async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  const newOrder = new Order({
    userId,
    items,
    totalAmount,
    date: new Date().toISOString(),
  });

  try {
    const createdOrder = await newOrder.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
