const db = require('../config/database');
exports.create=(newQuestion,callback)=>{
    sql="INSERT questions INTO (?,?,?,?)";
   
    db.query(sql,newQuestion,callback);


}