const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

module.exports = (db) => {
  const router = express.Router();

  // Middleware to verify token
  const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send('No token provided');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send('Unauthorized: Invalid token');
      }
      req.userId = decoded.id;
      next();
    });
  };

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
        return res.status(401).send('Invalid credentials');
      }

      const user = results[0];

      try {
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
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
  router.post('/cart/add', verifyToken, (req, res) => {
    const { food_id, quantity } = req.body;
    const user_id = req.userId;

    if (!user_id || !food_id) {
      return res.status(400).send('User ID and Food ID are required');
    }

    const sql = `
      INSERT INTO cart (user_id, food_id, quantity) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE 
        quantity = quantity + VALUES(quantity)
    `;
    db.query(sql, [user_id, food_id, quantity || 1], (err) => {
      if (err) {
        console.error('Error adding to cart:', err);
        res.status(500).send('Failed to add to cart');
      } else {
        res.status(201).send('Item added to cart successfully');
      }
    });
  });

  // Fetch items in the user's cart
  router.get('/cart', verifyToken, (req, res) => {
    const userId = req.userId;

    const sql = `
      SELECT cart.id AS cart_id, cart.quantity, food_listings.title, food_listings.price, food_listings.image
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
  router.delete('/cart/remove/:cart_id', verifyToken, (req, res) => {
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

  // Update user password
  router.put('/update-password', verifyToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).send('Both old and new passwords are required');
    }

    const sql = 'SELECT password FROM users WHERE id = ?';
    db.query(sql, [req.userId], async (err, results) => {
      if (err) {
        console.error('Error fetching user password:', err);
        return res.status(500).send('Server error');
      }

      const user = results[0];
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).send('Old password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = 'UPDATE users SET password = ? WHERE id = ?';
      db.query(updateSql, [hashedPassword, req.userId], (error) => {
        if (error) {
          console.error('Error updating password:', error);
          res.status(500).send('Failed to update password');
        } else {
          res.status(200).send('Password updated successfully');
        }
      });
    });
  });

  return router;
};
