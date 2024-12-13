const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');
const path = require('path'); // Required to handle paths

// Configure environment variables
dotenv.config();

// Create an Express application
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
    db.query('SHOW TABLES;', (error, results) => {
      if (error) {
        console.error('Error fetching tables:', error);
      } else {
        console.log('Database Tables:', results);
      }
    });
  }
});

// Import routes
const userRoutes = require('./routes/userRoutes')(db);
const foodRoutes = require('./routes/foodRoutes')(db);
// Add cart-specific routes if not handled in `userRoutes`
const cartRoutes = require('./routes/cartRoutes')(db); // Ensure this route exists

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes); // Use dedicated cart route

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
