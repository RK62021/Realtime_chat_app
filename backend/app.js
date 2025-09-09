const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const {errorHandler} = require('./src/middleware/error.middleware.js');

const app = express(); // Initialize express app
dotenv.config(); // Load environment variables
app.use(cors(
    {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
)); // Enable CORS for all routes

app.use(express.json({limit: '1mb'})); // To handle large payloads
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // To handle URL-encoded data


// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// error handling middleware
app.use(errorHandler);

module.exports = app;