import mysql from 'mysql2';

export default mysql.createConnection({
  host: 'localhost',
  user: 'test',
  password: 'test',
  database: 'testdb',
});
