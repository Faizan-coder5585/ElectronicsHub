const jwt = require('jsonwebtoken');

exports.generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {  expiresIn: '1h' });
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Access token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Now req.user.id is available
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
