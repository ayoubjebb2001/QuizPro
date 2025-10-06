var express = require('express');
var router = express.Router();
const QuestionController= require('../Controllers/QuestionsController');
const Category = require('../Models/Category'); 
router.get('', (req, res) => {
  Category.getAllCategories((err, result) => {
    // if (err) return res.status(500).json({ error: err });
    if(err) return res.render("Quiz/category",{categories:[],error:err})
    
   res.render("Quiz/categoryQ",{categories:result});
  });
});

router.get('/category/:id',QuestionController.QuestionParCategory);
module.exports=router;
