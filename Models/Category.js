const db = require('../config/database');
exports.getAllCategories=(callback)=>{
    db.query('SELECT * FROM categories',callback);
}
exports.createCategory = (newCategory, callback) => {
    const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    const values = [newCategory.name, newCategory.description];

    db.query(sql, values, callback);
};
exports.updateCategory=(infoCatego,CategoryId,callback)=>{
 const sql="UPDATE  categories SET ? WHERE ?";
 const values=[infoCatego.name,infoCatego.description];
 const categoryid=CategoryId;
 db.query(sql,values,categoryid,callback);
}