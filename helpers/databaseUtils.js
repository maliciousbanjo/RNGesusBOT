const mysql = require('mysql');
const config = require('../config.json');

// TODO: Deprecate
// const connection = mysql.createConnection({
//   host: config.dbHost,
//   user: config.dbUsername,
//   password: config.dbPassword,
//   database: config.database,
//   multipleStatements: true,
// });

const pool = mysql.createPool({
  connectionLimit: 10, // default value
  host: config.dbHost,
  user: config.dbUsername,
  password: config.dbPassword,
  database: config.database,
  multipleStatements: true,
});

module.exports = {
  // TODO: Deprecate
  // /**
  //  * Connect to the MySQL database
  //  */
  // connect: () => {
  //   connection.connect((error) => {
  //     if (error) {
  //       console.error(`MySQL ${error}`);
  //       throw error;
  //     }
  //     console.log('Connected to MySQL');
  //   });
  // },

  // /**
  //  * Return the MySQL connection
  //  *
  //  * @returns {mysql.Connection} Active MySQL connection
  //  */
  // getDbConnection: () => {
  //   return connection;
  // },

  /**
   * Return the MySQL connection pool
   *
   * @returns {mysql.Pool} MySQL connection pool
   */
  getConnectionPool: () => {
    return pool;
  },
};
