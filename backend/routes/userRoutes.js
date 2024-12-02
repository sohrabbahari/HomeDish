const express = require('express');

module.exports = (db) => {
  const router = express.Router();

  // User Registration Endpoint
  router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, password], (error, results) => {
      if (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Failed to register user');
      } else {
        res.status(201).send('User registered successfully');
      }
    });
  });

  // User Login Endpoint
  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (error, results) => {
      if (error) {
        console.error('Error logging in user:', error);
        res.status(500).send('Failed to log in');
      } else if (results.length > 0) {
        res.status(200).send('Login successful');
      } else {
        res.status(401).send('Invalid credentials');
      }
    });
  });

  return router;
};
