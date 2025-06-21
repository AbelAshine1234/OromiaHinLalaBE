const express = require('express');
require('dotenv').config();
const sequelize = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const reviewRoutes = require('./routes/reviewsRoutes');
const packageRoutes = require('./routes/packageRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/images', imageRoutes);

app.get('/', async (req, res) => {
    try {
        await sequelize.authenticate();
        res.send('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        res.status(500).send('Error connecting to database');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 