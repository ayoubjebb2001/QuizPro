const Question = require('../Models/Question');


exports.getAllQuestion = function (req, res) {
    Question.getAll((err, result) => {

        if (err) {
            return res.render("Question/gestionQ", {"questions": [], error: err.message });
        }

        result = result.map(item => {
            return {
                ...item,
                options: item.options,
                answer: item.answer
            }
        });

        return  res.render("Question/gestionQ", { "questions": result, error: null });
    }); 
};



exports.createQuestion = function (req, res) {
    const { question, category_id, options, answer } = req.body;
  

    if (!question || !category_id || !options || !answer) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const newQuestion = [
        question,
        category_id,
        JSON.stringify(options),
        JSON.stringify(answer)
    ];

    Question.create(newQuestion, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: '✅ Question créée avec succès', id: result.insertId });
    });
};

exports.DeleteQuestion=function(req,res){
  
    
    const QuestionId=req.params.id;
    Question.delete(QuestionId,(err,result)=>{{
         if (err) return res.status(500).json({ error: err.message });
         res.json({message:'Question deleted avec succes !'});
    }})

}
exports.UpdateQuestion = function(req, res) {
    const { question, category_id, options, answer } = req.body;
    const data = { question, category_id, options, answer };

    Question.update(req.params.id, data, (err, result) => {
        if (err) {
            console.error("Erreur SQL :", err); 
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Question updated avec succès' });
    });
};

exports.QuestionParCategory= function(req,res){

     const categoryId=req.params.id;
     console.log("categoryid",categoryId);
 
     Question.QuestionParCategory(categoryId,(err,result)=>{

        if(err) return res.status(500).json({error:err.message});
        res.json({message: " questions par category  est :",questions:result}); 
     })
    
}