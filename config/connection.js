// This file is from Sequelize documentation and tutorial
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option 1: Passing a connection URI
// const sequelize = new Sequelize('sqlite::memory:') // Example for sqlite
// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') // Example for postgres

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: 'path/to/database.sqlite'
// });

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USERNAME, 
  process.env.DB_PASSWORD, 
  {
    host: 'localhost',
    dialect: 'mysql', /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
    port: 3306 // This is the port for MySQL server, which automatically starts on my laptop when it starts
  }
);

module.exports = sequelize;

