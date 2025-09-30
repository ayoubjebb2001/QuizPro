var express = require('express');
var router = express.Router();

const CategoryController = require('../Controllers/CategoryController');
 router.get('/',CategoryController.listCategory);

module.exports = router;