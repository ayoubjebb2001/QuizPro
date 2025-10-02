
var express = require('express');
var router = express.Router();
const QuestionController= require('../Controllers/QuestionsController');
router.get('/',QuestionController.getAllQuestion);
const Category = require('../Models/Category'); 
const Question=require('../Models/Question');

router.get('/update/:id', (req, res) => {
    Question.getOne(req.params.id, (err, questions) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération de la question" });
        }

        if (questions && questions.length > 0) {
            questions[0].options = questions[0].options ? JSON.parse(questions[0].options) : [];
            questions[0].answer = questions[0].answer ? JSON.parse(questions[0].answer) : [];
        }

        Category.getAllCategories((err, categories) => {
            if (err) return res.status(500).json({ error: err });
        
            res.render('Question/formQ', { 
                questions, 
                categories 
            }); 
        });
    });
});

router.get('/add', (req, res) => {
    Category.getAllCategories((err, categories) => {
        if (err) return res.status(500).json({ error: err });
        res.render('Question/formQ', { 
            categories, 
            questions: null  // باش ejs يلقاها ديما
        }); 
    });
});


router.post('/add',QuestionController.createQuestion);
router.delete('/delete/:id',QuestionController.DeleteQuestion);





router.put('/update/:id',QuestionController.UpdateQuestion);
module.exports = router;