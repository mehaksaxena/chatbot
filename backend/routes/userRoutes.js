const express = require('express');
const {
  getAllUsers,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, getAllUsers); 
router.delete('/:id', authMiddleware, deleteUser); 
router.put('/:id', authMiddleware, updateUser); 

module.exports = router;
