const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Add item to cart
  router.post('/add', (req, res) => {
    const { user_id, food_id, quantity } = req.body;

    if (!user_id || !food_id) {
      return res.status(400).send('User ID and Food ID are required');
    }

    const sql = 'INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)';
    db.query(sql, [user_id, food_id, quantity || 1], (err, results) => {
      if (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Failed to add to cart');
      } else {
        res.status(201).send('Item added to cart successfully');
      }
    });
  });

  // Get all items in the user's cart
  router.get('/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = `
      SELECT cart.id, cart.quantity, food_listings.title, food_listings.price, food_listings.image
      FROM cart
      JOIN food_listings ON cart.food_id = food_listings.id
      WHERE cart.user_id = ?
    `;
    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching cart items:', err);
        res.status(500).send('Failed to fetch cart items');
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Remove item from cart
  router.delete('/remove/:cart_id', (req, res) => {
    const cartId = req.params.cart_id;

    const sql = 'DELETE FROM cart WHERE id = ?';
    db.query(sql, [cartId], (err, results) => {
      if (err) {
        console.error('Error removing item from cart:', err);
        res.status(500).send('Failed to remove item from cart');
      } else {
        res.status(200).send('Item removed from cart successfully');
      }
    });
  });

  return router;
};
