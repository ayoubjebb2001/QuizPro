var express = require('express');
var router = express.Router();
var guest = require('../middlewares/guest');
var auth = require('../middlewares/auth');
const AuthController = require('../Controllers/authController');

router.get('/login', guest, function (req, res) {
    // Récupérer le message d'erreur de la session et le supprimer
    const errorMessage = req.session.errorMessage || null;
    delete req.session.errorMessage;

    res.render('login', {
        title: 'Log in',
        username: null,
        errorMessage: errorMessage
    });
});

router.post('/login', guest, AuthController.login);

router.post('/logout', auth, AuthController.logout);

module.exports = router;