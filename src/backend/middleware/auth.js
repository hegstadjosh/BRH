// middleware/auth.js

const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret_key'; // Use the same secret key as in authController.js

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Token is not valid' });
  }
}

module.exports = authenticateToken;
