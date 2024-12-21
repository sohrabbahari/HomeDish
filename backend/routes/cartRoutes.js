const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // Add item to cart
  router.post('/add', (req, res) => {
    const { user_id, food_id, quantity } = req.body;

    console.log('Incoming request to add item to cart:', req.body); // Log request body

    if (!user_id || !food_id) {
      console.error('Validation Error: Missing user_id or food_id');
      return res.status(400).json({ message: 'User ID and Food ID are required' });
    }

    const sql = 'INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)';
    db.query(sql, [user_id, food_id, quantity || 1], (err) => {
      if (err) {
        console.error('Error adding to cart:', err);
        return res.status(500).json({ message: 'Failed to add to cart' });
      }
      console.log('Item added to cart successfully');
      return res.status(201).json({ message: 'Item added to cart successfully' });
    });
  });

  // Get all items in the user's cart
  router.get('/:user_id', (req, res) => {
    const userId = req.params.user_id;

    console.log('Incoming request to fetch cart items for user ID:', userId); // Log user ID

    const sql = `
      SELECT cart.id AS cart_id, cart.quantity, food_listings.title, 
             food_listings.price, food_listings.image, food_listings.id AS food_id
      FROM cart
      JOIN food_listings ON cart.food_id = food_listings.id
      WHERE cart.user_id = ?
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching cart items:', err);
        return res.status(500).json({ message: 'Failed to fetch cart items' });
      }
      console.log('Cart items fetched successfully:', results);
      return res.status(200).json(results);
    });
  });

  // Remove item from cart
  router.delete('/remove/:cart_id', (req, res) => {
    const cartId = req.params.cart_id;

    console.log('Incoming request to remove cart item with ID:', cartId); // Log cart item ID

    const sql = 'DELETE FROM cart WHERE id = ?';
    db.query(sql, [cartId], (err) => {
      if (err) {
        console.error('Error removing item from cart:', err);
        return res.status(500).json({ message: 'Failed to remove item from cart' });
      }
      console.log('Cart item removed successfully');
      return res.status(200).json({ message: 'Item removed from cart successfully' });
    });
  });

  // Checkout (Bulk Place Orders)
  router.post('/checkout', async (req, res) => {
    console.log('Incoming Checkout Request:', req.body); // Log request body

    const { user_id, items } = req.body;

    if (!user_id || !items || items.length === 0) {
      console.error('Validation Error: Missing required fields');
      return res.status(400).json({ message: 'User ID and at least one item are required' });
    }

    const sql = `
      INSERT INTO orders (food_id, buyer_id, delivery_address, payment_method)
      VALUES (?, ?, ?, ?)
    `;

    try {
      // Process all orders using Promise.all for parallel execution
      await Promise.all(
        items.map((item, index) => {
          return new Promise((resolve, reject) => {
            db.query(sql, [item.food_id, user_id, item.delivery_address, item.payment_method], (err) => {
              if (err) {
                console.error(`Error placing order for item ${index}:`, err);
                reject(err);
              } else {
                resolve();
              }
            });
          });
        })
      );
      console.log('All orders placed successfully');
      return res.status(201).json({ message: 'Orders placed successfully' });
    } catch (error) {
      console.error('Error during checkout:', error);
      return res.status(500).json({ message: 'Some orders could not be placed' });
    }
  });

  return router;
};
