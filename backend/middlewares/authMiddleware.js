const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) return res.status(401).json({ error: 'Invalid token or user not found.' });

    req.user = { id: user.id };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized access.' });
  }
};

module.exports = authMiddleware;
