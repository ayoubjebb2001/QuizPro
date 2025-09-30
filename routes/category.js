var express = require('express');
var router = express.Router();

const CategoryController = require('../Controllers/CategoryController');
 router.get('/',CategoryController.listCategory);
 router.post('/add',CategoryController.newCategory);
 router.put('/update/:id',CategoryController.updateCategory);
 router.delete('/delete',CategoryController.deleteCategory);

module.exports = router;