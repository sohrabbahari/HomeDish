const express = require('express');
const multer = require('multer');
const path = require('path');

module.exports = (db) => {
  const router = express.Router();

  // Middleware to log all incoming requests
  router.use((req, res, next) => {
    console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });

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

    const sql =
      "INSERT INTO food_listings (title, description, price, user_id, image, is_sold) VALUES (?, ?, ?, ?, ?, 0)";
    db.query(sql, [title, description, price, user_id, image], (error) => {
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

  // Mark a food listing as sold
  router.put('/mark-sold/:food_id', (req, res) => {
    const { food_id } = req.params;

    const sql = "UPDATE food_listings SET is_sold = 1 WHERE id = ?";
    db.query(sql, [food_id], (error) => {
      if (error) {
        console.error('Error marking food as sold:', error);
        res.status(500).send('Failed to mark food as sold');
      } else {
        res.status(200).send('Food marked as sold successfully');
      }
    });
  });

  // Simulate delivery status
  router.get('/delivery-status/:order_id', (req, res) => {
    const { order_id } = req.params;

    const statuses = [
      { status: 'Order Received', coordinates: { lat: 37.7749, lng: -122.4194 } },
      { status: 'Driver Assigned', coordinates: { lat: 37.7750, lng: -122.4180 } },
      { status: 'En Route', coordinates: { lat: 37.7751, lng: -122.4170 } },
      { status: 'Delivered', coordinates: { lat: 37.7752, lng: -122.4160 } },
    ];

    const index = parseInt(order_id) % statuses.length;
    const currentStatus = statuses[index];

    res.status(200).json({
      order_id,
      status: currentStatus.status,
      driver_location: currentStatus.coordinates,
    });
  });

  // Fetch orders for a specific user
  router.get('/orders/:user_id', (req, res) => {
    const userId = req.params.user_id;

    const sql = `
      SELECT orders.id AS order_id, orders.delivery_address, orders.payment_method,
             food_listings.title, food_listings.price, food_listings.image, food_listings.is_sold
      FROM orders
      JOIN food_listings ON orders.food_id = food_listings.id
      WHERE orders.buyer_id = ?
    `;

    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Failed to fetch orders');
      } else {
        res.status(200).json(results);
      }
    });
  });

  // Place a single order
  router.post('/buy', (req, res) => {
    console.log('Incoming Place Order Request:', req.body);

    const { food_id, buyer_id, delivery_address, payment_method } = req.body;

    if (!food_id || !buyer_id || !delivery_address || !payment_method) {
      console.error('Validation Error: Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const sql = `
      INSERT INTO orders (food_id, buyer_id, delivery_address, payment_method) 
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [food_id, buyer_id, delivery_address, payment_method], (error, results) => {
      if (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
      } else {
        res.status(201).json({ message: 'Order placed successfully', order_id: results.insertId });
      }
    });
  });

  // Place bulk orders (checkout)
  router.post('/checkout', (req, res) => {
    console.log('Incoming Checkout Request:', req.body);

    const { user_id, items } = req.body;

    if (!user_id || !items || items.length === 0) {
      console.error('Validation Error: Missing required fields');
      return res.status(400).json({ message: 'User ID and at least one item are required' });
    }

    const sql = `
      INSERT INTO orders (food_id, buyer_id, delivery_address, payment_method)
      VALUES (?, ?, ?, ?)
    `;

    let failed = false;
    items.forEach((item) => {
      db.query(sql, [item.food_id, user_id, item.delivery_address, item.payment_method], (error) => {
        if (error) {
          console.error('Error placing order:', error);
          failed = true;
        }
      });
    });

    if (failed) {
      res.status(500).json({ message: 'Some orders could not be placed' });
    } else {
      res.status(201).json({ message: 'Orders placed successfully' });
    }
  });

  return router;
};
