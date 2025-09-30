const db = require('../config/database');
exports.getAllCategories=(callback)=>{
    db.query('SELECT * FROM categories',callback);






}