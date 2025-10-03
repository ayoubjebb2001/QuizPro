const db = require('../config/database');
exports.getAll = (callback) => {
    const sql = `
       SELECT c.id as category_id, c.description, c.name,q.id, q.question, q.options, q.answer
FROM categories c
JOIN questions q ON c.id = q.category_id`;
    db.query(sql,callback);
};
exports.getOne=(QuestionId,callback)=>{
const sql=`SELECT c.id as category_id,c.description,c.name,q.id,q.question,q.answer,q.options
FROM categories c JOIN questions q ON c.id=q.category_id WHERE q.id=? `;
db.query(sql,QuestionId,callback)

}
exports.create = (newQuestion, callback) => {
    const sql = "INSERT INTO questions (question,category_id,options,answer) VALUES (?, ?, ?, ?)";
    db.query(sql,newQuestion, callback);
}
exports.delete=(QuestionId,callback)=>{

    const sql="DELETE FROM questions WHERE id=?";
    db.query(sql,QuestionId,callback);
}
exports.update = (QuestionId, data, callback) => {
    const sql = "UPDATE questions SET question=?, category_id=?, options=?, answer=? WHERE id=?";
    const values = [
        data.question,
        data.category_id,
        JSON.stringify(data.options),
        JSON.stringify(data.answer),
        QuestionId
    ];
    db.query(sql, values, callback);
};
exports.QuestionParCategory= function(categoryId,callback){
const sql ="SELECT c.id  as category_id, c.description,c.name,q.id,q.answer,q.options FROM categories c JOIN questions q ON c.id=q.category_id WHERE q.category_id=? "
 db.query(sql,categoryId,callback);

}


