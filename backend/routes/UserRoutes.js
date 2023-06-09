const express = require('express');
const router = express.Router();

// Controller
const {register, login, getCurrentUser, getAllUsers, getUserById, editProfile} = require('../Controllers/UserController');

// Middlewares
const {authGuard} = require('../middlewares/authGuard');

// Routes
// user
router.post('/register', register);
router.post('/login', login);
router.get('/profile', authGuard, getCurrentUser);
router.get('/usuarios', authGuard, getAllUsers);
router.get('/usuario/:id', authGuard, getUserById);
router.patch('/edit', authGuard, editProfile);



module.exports = router;