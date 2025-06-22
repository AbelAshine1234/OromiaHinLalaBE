const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const packageRoutes = require('./routes/packageRoutes');
const imageRoutes = require('./routes/imageRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const authRoutes = require('./auth/authRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for your frontend origin(s)
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true, // if you want to allow cookies/auth headers
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (e.g. uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/checkouts', checkoutRoutes);

// Simple root endpoint to verify DB connection
app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    res.status(500).send('Error connecting to database');
  }
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
      console.log(`CORS allowed for origin: ${process.env.FRONTEND_ORIGIN || 'http://localhost:8080'}`);
    });
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
