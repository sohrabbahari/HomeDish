const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');

// Configure environment variables
dotenv.config();

// Create an Express application
const app = express();

// Middleware for handling CORS and parsing JSON
app.use(cors());
app.use(express.json());

// Set up a MySQL database connection
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
  }
});

// Import routes and pass `db` to them
const userRoutes = require('./routes/userRoutes')(db);
const foodRoutes = require('./routes/foodRoutes')(db);

// Use the imported routes
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});