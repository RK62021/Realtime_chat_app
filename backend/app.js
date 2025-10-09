const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const routes = require('./src/routes/index.js');
const {errorHandler} = require('./src/middleware/error.middleware.js');
const cookieParser = require('cookie-parser');  // Import cookie-parser
const passport = require('passport');


// Initialize express app
const app = express(); // Initialize express app
dotenv.config(); // Load environment variables
app.use(cors(
    {
        origin: 'http://localhost:5173', // Allow requests from this origin
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    }
)); // Enable CORS for all routes

app.use(express.json({limit: '1mb'})); // To handle large payloads
app.use(express.urlencoded({ extended: true, limit: '1mb' })); // To handle URL-encoded data
app.use(cookieParser()); // Use cookie-parser middleware
app.use(passport.initialize()); // Initialize passport





// Routes
app.use('/api/v1', routes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

// error handling middleware
app.use(errorHandler);

module.exports = app;