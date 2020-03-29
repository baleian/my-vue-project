var mysql = require('mysql2');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'test',
  database: 'testdb',
});

module.exports = connection;
