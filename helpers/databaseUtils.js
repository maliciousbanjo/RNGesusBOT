const mysql = require('mysql');
const config = require('../config.json');

const connection = mysql.createConnection({
  host: config.dbHost,
  user: config.dbUsername,
  password: config.dbPassword,
  database: config.database,
  multipleStatements: true,
});

module.exports = {
  /**
   * Connect to the MySQL database
   */
  connect: () => {
    connection.connect((error) => {
      if (error) throw error;
      console.log('Connected to MySQL');
    });
  },

  /**
   * Return the MySQL connection
   *
   * @returns {mysql.Connection} Active MySQL connection
   */
  getDbConnection: () => {
    return connection;
  },
};
