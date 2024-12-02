const express = require('express');

// Export the routes as a function that accepts `db`
module.exports = (db) => {
  const router = express.Router();

  // Add a new food listing
  router.post('/add', (req, res) => {
    const { userId, title, description, price } = req.body;
    const sql = "INSERT INTO food_listings (user_id, title, description, price) VALUES (?, ?, ?, ?)";
    db.query(sql, [userId, title, description, price], (error, results) => {
      if (error) {
        console.error('Error adding food listing:', error);
        res.status(500).send('Failed to add food listing');
      } else {
        res.status(201).send('Food listing added successfully');
      }
    });
  });

  // Get all food listings
  router.get('/', (req, res) => {
    const sql = "SELECT * FROM food_listings";
    db.query(sql, (error, results) => {
      if (error) {
        console.error('Error fetching food listings:', error);
        res.status(500).send('Failed to fetch food listings');
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Get a food listing by ID
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM food_listings WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        console.error('Error fetching food listing:', error);
        res.status(500).send('Failed to fetch food listing');
      } else if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send('Food listing not found');
      }
    });
  });

  // Update a food listing by ID
  router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const sql = "UPDATE food_listings SET title = ?, description = ?, price = ? WHERE id = ?";
    db.query(sql, [title, description, price, id], (error, results) => {
      if (error) {
        console.error('Error updating food listing:', error);
        res.status(500).send('Failed to update food listing');
      } else {
        res.status(200).send('Food listing updated successfully');
      }
    });
  });

  // Delete a food listing by ID
  router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM food_listings WHERE id = ?";
    db.query(sql, [id], (error, results) => {
      if (error) {
        console.error('Error deleting food listing:', error);
        res.status(500).send('Failed to delete food listing');
      } else {
        res.status(200).send('Food listing deleted successfully');
      }
    });
  });

  return router;
};
