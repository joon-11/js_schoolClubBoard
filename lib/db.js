var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'board'
});
db.connect();

module.exports = db;