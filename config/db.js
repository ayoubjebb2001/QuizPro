require('dotenv').config();
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});


connection.connect(function(err){
    if(err)
        console.error(err);
    console.log("connected to mysql server");
})

module.exports = connection;