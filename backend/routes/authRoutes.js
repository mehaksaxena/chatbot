const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);


module.exports = router;
