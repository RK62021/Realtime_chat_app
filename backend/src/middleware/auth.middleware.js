const { verifyToken } = require("../utils/jwt.js");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Get the Authorization header

  // Check if header exists and has Bearer format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = verifyToken(token, process.env.JWT_SECRET);
    req.user = user; // attach decoded user info (e.g., id, email) to request
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
