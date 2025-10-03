var express = require('express');
var router = express.Router();
const AuthController = require('../Controllers/authController');

router.get('/login', function(req, res) {
    res.render('login', { title: 'Log in' });
});

router.post('/login', AuthController.login);

router.post('/logout',AuthController.logout)

module.exports = router