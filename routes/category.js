var express = require('express');
var router = express.Router();

const CategoryController = require('../Controllers/CategoryController');
 router.get('/',CategoryController.listCategory);
 router.post('/',CategoryController.newCategory);
 router.put('/:id',CategoryController.updateCategory);

module.exports = router;