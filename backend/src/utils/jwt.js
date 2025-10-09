const jwt = require('jsonwebtoken'); // Import jsonwebtoken

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET; // Get the JWT secret from environment variables
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET; // Get the JWT refresh secret from environment variables

// Function to generate an access token
const generateAccessToken = ({ id, username, email }) => {
  const payload = { id, username, email };
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' }); // Token expires in 15 minutes
};

// Function to generate a refresh token
const generateRefreshToken = ({ id, username, email }) => {
  const payload = { id, username, email };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' }); // Token expires in 7 days
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
