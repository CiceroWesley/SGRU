const express = require('express');
const router = express.Router();

// Controller
const {register, login, getCurrentUser} = require('../Controllers/UserController');

// Middlewares
const {authGuard} = require('../middlewares/authGuard');

// Routes
// user
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authGuard, getCurrentUser);



module.exports = router;