const Question=require('../Models/Question');


exports.createQuestion=function (req,res){
const {question,category_id,options,answer}=req.body;
const newQuestion={question,category_id,options,answer};

if(question||category_id||options||answer){
    return res.json({message:" le cham  est required "});
}
Question.create(newQuestion,(err,result)=>{
  if (err) throw err;
     res.json({ message: 'question created successfully' });



})



}