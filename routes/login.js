var express = require('express');
var router = express.Router();
var guest = require('../middlewares/guest');
var auth = require('../middlewares/auth');
const AuthController = require('../Controllers/authController');

router.get('/login', guest, function(req, res) {
    res.render('login', { title: 'Log in', username : null });
});

router.post('/login', guest, AuthController.login);

router.post('/logout',auth, AuthController.logout);

module.exports = router;