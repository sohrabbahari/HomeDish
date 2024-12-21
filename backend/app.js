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
app.use(cors({
  origin: '*', // In production, replace '*' with your frontend's specific URL (e.g., 'http://192.168.12.220:3000')
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  console.log(`Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }
  next();
});

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up MySQL database connection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

let db;

const connectToDatabase = () => {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(connectToDatabase, 5000); // Retry connection after 5 seconds
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

  db.on('error', (err) => {
    console.error('MySQL Error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connectToDatabase(); // Reconnect on connection loss
    } else {
      throw err;
    }
  });
};

connectToDatabase();

// Import routes
const userRoutes = require('./routes/userRoutes')(db);
const foodRoutes = require('./routes/foodRoutes')(db);
const cartRoutes = require('./routes/cartRoutes')(db); // Ensure cartRoutes is imported and used

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/cart', cartRoutes); // Register the cart routes here

// Default error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Default 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('SIGINT received. Closing MySQL connection...');
  db.end(() => {
    console.log('MySQL connection closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing MySQL connection...');
  db.end(() => {
    console.log('MySQL connection closed.');
    process.exit(0);
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
