
var express = require('express');
var router = express.Router();
const QuestionController= require('../Controllers/QuestionsController');
router.post('/add',QuestionController.createQuestion);
module.exports = router;