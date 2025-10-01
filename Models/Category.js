const db = require('../config/database');
exports.getAllCategories=(callback)=>{
    db.query('SELECT * FROM categories',callback);
}
exports.createCategory = (newCategory, callback) => {
    const sql = 'INSERT INTO categories (name, description) VALUES (?, ?)';
    const values = [newCategory.name, newCategory.description];

    db.query(sql, values, callback);
};exports.updateCategoryAsync = function(infoCatego, categoryId) {
    return new Promise((resolve, reject) => {
        const sql = "UPDATE categories SET NAME = ?, description = ? WHERE id = ?";
        db.query(sql, [infoCatego.name, infoCatego.description, categoryId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteCategoryAsync = function(categoryId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM categories WHERE id = ?";
        db.query(sql, categoryId, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
