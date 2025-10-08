var express = require('express');
var router = express.Router();

var admin = require('../middlewares/admin');
const AdminController = require('../Controllers/AdminController');

router.get('/users', admin, AdminController.showUsers);

module.exports = router;
