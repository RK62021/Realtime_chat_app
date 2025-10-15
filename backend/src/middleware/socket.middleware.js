// middleware/socket.middleware.js
const { verifyToken } = require('../utils/jwt.js');

function SocketAuthMiddleware(socket, next) {
  // Get token from auth object (preferred)
  const token = socket.handshake.auth?.token;

  if (!token) return next(new Error('No token provided'));

  try {
    const user = verifyToken(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    socket.user = user; // attach decoded user info
    next();
  } catch (err) {
    next(new Error('Invalid or expired token'));
  }
}

module.exports = SocketAuthMiddleware;
