const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/authController');
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/register', protect, requireSuperAdmin, register);

module.exports = router;