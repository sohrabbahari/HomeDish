const express = require('express');
const bcrypt = require('bcrypt'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating tokens
const dotenv = require('dotenv');

dotenv.config();

module.exports = (db) => {
  const router = express.Router();

  // Register a user
  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send('All fields are required');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(sql, [name, email, hashedPassword], (err, results) => {
        if (err) {
          console.error('Error registering user:', err);
          res.status(500).send('User registration failed');
        } else {
          res.status(201).send('User registered successfully');
        }
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      res.status(500).send('Server error');
    }
  });

  // Login a user
  router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('All fields are required');
    }

    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], async (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).send('Server error');
      }

      if (results.length === 0) {
        console.error('User not found for email:', email);
        return res.status(401).send('Invalid credentials');
      }

      const user = results[0];

      try {
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.debug('Password comparison result:', passwordMatch);

        if (!passwordMatch) {
          console.error('Password mismatch for user:', user.email);
          return res.status(401).send('Invalid credentials');
        }

        const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        });

        res.status(200).json({ message: 'Login successful', token, user });
      } catch (error) {
        console.error('Error comparing passwords:', error);
        res.status(500).send('Server error');
      }
    });
  });

  // Add item to cart
  router.post('/cart/add', (req, res) => {
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
  router.get('/cart/:user_id', (req, res) => {
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
  router.delete('/cart/remove/:cart_id', (req, res) => {
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
