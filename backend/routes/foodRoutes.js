const express = require('express');
const multer = require('multer');
const path = require('path');

module.exports = (db) => {
  const router = express.Router();

  // Configure multer for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Generate unique filenames
    },
  });

  const upload = multer({ storage });

  // Add a new food listing
  router.post('/add', upload.single('image'), (req, res) => {
    const { title, description, price, user_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !description || !price || !user_id || !image) {
      return res.status(400).send('All fields are required');
    }

    const sql = "INSERT INTO food_listings (title, description, price, user_id, image) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [title, description, price, user_id, image], (error, results) => {
      if (error) {
        console.error('Error adding food listing:', error);
        res.status(500).send('Failed to add food listing');
      } else {
        res.status(201).send('Food listing added successfully');
      }
    });
  });

  // Fetch all food listings
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

  // Fetch food listings uploaded by a specific user
  router.get('/my-listings/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const sql = "SELECT * FROM food_listings WHERE user_id = ?";
    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching user listings:', error);
        res.status(500).send('Failed to fetch user listings');
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Purchase a food item
  router.post('/buy', (req, res) => {
    const { food_id, buyer_id } = req.body;

    if (!food_id || !buyer_id) {
      return res.status(400).send('Food ID and Buyer ID are required');
    }

    // Verify that the food exists
    const verifyFoodSQL = "SELECT * FROM food_listings WHERE id = ?";
    db.query(verifyFoodSQL, [food_id], (error, results) => {
      if (error) {
        console.error('Error verifying food existence:', error);
        return res.status(500).send('Server error while verifying food');
      }

      if (results.length === 0) {
        return res.status(404).send('Food not found');
      }

      // Proceed with the purchase
      const sql = "UPDATE food_listings SET buyer_id = ? WHERE id = ?";
      db.query(sql, [buyer_id, food_id], (updateError, updateResults) => {
        if (updateError) {
          console.error('Error purchasing food:', updateError);
          res.status(500).send('Failed to purchase food');
        } else {
          res.status(200).send('Food purchased successfully');
        }
      });
    });
  });

  return router;
};
