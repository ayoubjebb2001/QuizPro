
var express = require('express');
var router = express.Router();
const QuestionController= require('../Controllers/QuestionsController');
router.get('/',QuestionController.getAllQuestion);
router.post('/add',QuestionController.createQuestion);
router.delete('/delete/:id',QuestionController.DeleteQuestion);
router.put('/update/:id',QuestionController.UpdateQuestion);
module.exports = router;