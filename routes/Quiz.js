var express = require('express');
var router = express.Router();
const QuestionController= require('../Controllers/QuestionsController');
const CategoryController=require('../Controllers/CategoryController');
router.get('/:id',QuestionController.QuestionParCategory);
router.get('',CategoryController.listCategory);
