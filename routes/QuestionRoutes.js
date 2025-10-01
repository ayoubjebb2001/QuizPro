
var express = require('express');
var router = express.Router();
const QuestionController= require('../Controllers/QuestionsController');
router.get('/',QuestionController.getAllQuestion);
const Category = require('../Models/Category'); 


router.get('/add', (req, res) => {

    Category.getAllCategories((err, categories) => {
        if (err) {
            return res.status(500).json({ error: "Erreur lors de la récupération des catégories" });
        }
        
        res.render('Question/formQ', { categories });
    });
});


router.post('/add',QuestionController.createQuestion);
router.delete('/delete/:id',QuestionController.DeleteQuestion);
router.put('/update/:id',QuestionController.UpdateQuestion);
module.exports = router;