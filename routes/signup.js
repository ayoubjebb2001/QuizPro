var express = require('express');
var router = express.Router();
const AuthController = require('../Controllers/authController');

// GET signup page
router.get('', function(req, res) {
    res.render('signup', { title: 'Signup' });
});

// POST signup form - handle user registration
router.post('', AuthController.signup);

module.exports = router;